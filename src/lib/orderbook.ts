import assert from 'assert';
import { RBTree } from 'bintrees';
import { BigNumber } from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { Book, ChangeOrder, MatchOrder, NewOrder, Order, Orderbook, Trade } from '../types';

function Orderbook (this: any): Orderbook {
  if (this === undefined) { // check if it was called statically.
    return new (Orderbook as any)();
  }
  this.ordersByID = {};
  this.trades = [];
  this.bidState = new RBTree((a: Order, b: Order) => a.price.comparedTo(b.price));
  this.askState = new RBTree((a: Order, b: Order) => a.price.comparedTo(b.price));
  return this;
}

Orderbook.prototype.getTree = function(side: 'buy' | 'sell') {
  return side === 'buy' ? this.bidState : this.askState;
}

Orderbook.prototype.getTrades = function(): Trade[] {
  return this.trades;
}

Orderbook.prototype.state = function(book: Book): Book {
  if (book) {
    book.bids.forEach((order: any[]) =>
      this.add({
        id: order[2],
        side: 'buy',
        price: new BigNumber(order[0]),
        size: new BigNumber(order[1]),
      })
    );

    book.asks.forEach((order: any[]) =>
      this.add({
        id: order[2],
        side: 'sell',
        price: new BigNumber(order[0]),
        size: new BigNumber(order[1]),
      })
    );
  } else {
    book = { asks: [], bids: [] };

    this.bidState.reach((bid: any) => book.bids.push(...bid.orders));
    this.askState.each((ask: any) => book.asks.push(...ask.orders));
  }

  return book;
}

Orderbook.prototype.get = function(orderId: string): Order {
  return this.ordersByID[orderId];
}

Orderbook.prototype.add = function(order: NewOrder) {
  const newOrder: Order = {
    id: order.orderId || order.id,
    side: order.side,
    price: new BigNumber(order.price),
    size: new BigNumber(order.remainingSize || order.size),
  };

  const tree = this.getTree(newOrder.side);
  let node = tree.find({ price: newOrder.price });

  if (!node) {
    node = {
      price: newOrder.price,
      orders: [],
    };
    tree.insert(node);
  }

  node.orders.push(newOrder);
  this.ordersByID[newOrder.id] = newOrder;
}

Orderbook.prototype.remove = function(orderId: string) {
  const order = this.get(orderId);

  if (!order) {
    return;
  }

  const tree = this.getTree(order.side);
  const node = tree.find({ price: order.price });

  assert(node);

  const { orders } = node;

  orders.splice(orders.indexOf(order), 1);

  if (orders.length === 0) {
    tree.remove(node);
  }

  delete this.ordersByID[order.id];
}

Orderbook.prototype.match = function(match: MatchOrder) {
  const size = new BigNumber(match.size);
  const price = new BigNumber(match.price);
  const tree = this.getTree(match.side);
  const node = tree.find({ price: price });

  assert(node);

  const order = node.orders.find((order: Order) => order.id === match.makerOrderId);

  assert(order);

  order.size = order.size.minus(size);
  this.ordersByID[order.id] = order;

  assert(order.size.gte(0));

  if (order.size.eq(0)) {
    this.remove(order.id);
  }
}

Orderbook.prototype.update = function(change: ChangeOrder)  {

  // price of null indicates this is a market order
  if (change.price === null || change.price === undefined) {
    return;
  }

  const size = change.newSize ? new BigNumber(change.newSize) : undefined;
  const price = new BigNumber(change.price);
  const order = this.get(change.orderId);
  const tree = this.getTree(change.side);
  const node = tree.find({ price });

  if (!node || !node.orders.includes(order)) {
    return;
  }

  const nodeOrder = node.orders[node.orders.indexOf(order)];

  const newSize = parseFloat(order.size);
  const oldSize = change.oldSize ? parseFloat(change.oldSize) : undefined;

  assert.equal(oldSize, newSize);

  nodeOrder.size = size;
  this.ordersByID[nodeOrder.id] = nodeOrder;
}

Orderbook.prototype.processOrders = function() {
  let buyHead = this.getTree('buy').iterator().prev(); // Bottom of buy tree
  let sellHead = this.getTree('sell').iterator().next(); // Top of sell tree

  while (buyHead && sellHead && buyHead.price >= sellHead.price) {
    const buyOrder = { ...buyHead.orders[0] };
    const sellOrder = { ...sellHead.orders[0] };
    const sellSize = new BigNumber(sellOrder.size);
    const buySize = new BigNumber(buyOrder.size);

    const size = sellSize.gt(buySize) ? buySize : sellSize;

    assert(size.gte(0))

    // Sell
    this.match({
      ...sellOrder,
      price: sellHead.price,
      size,
      makerOrderId: sellOrder.id
    })
    // Buy
    this.match({
      ...buyOrder,
      price: buyHead.price,
      size,
      makerOrderId: buyOrder.id
    })

    // Add trade to trade history
    // Assuming market price is in seller's favour
    this.trades.push({
      id: uuidv4(),
      price: buyHead.price,
      sellerId: sellOrder.id,
      buyerId: buyOrder.id,
      created: new Date(),
      size
    })

    // Grab next available head if there are no more orders
    if (sellHead.orders.length <= 0) {
      sellHead = this.getTree('sell').iterator().next()
    }
    if (buyHead.orders.length <= 0) {
      buyHead = this.getTree('buy').iterator().prev()
    }
  }
}

export default Orderbook;
