import { Orderbook, checkState } from '../lib';
import { Book, ChangeOrder, MatchOrder, Trade } from '../types';

describe('Orderbook', () => {
  it('Add orders to orderbook', () => {
    const state: Book = {
      bids: [
        {
          id: 'id-001',
          side: 'buy',
          price: '39000.21',
          size: '12.12',
        },
        {
          id: 'id-002',
          side: 'buy',
          price: '31000.12',
          size: '10.1',
        },
        {
          id: 'id-006',
          side: 'buy',
          price: '30005.02',
          size: '10.1',
        },
        {
          id: 'id-007',
          side: 'buy',
          price: '30000.01',
          size: '10.1',
        },
      ],
      asks: [
        {
          id: 'id-005',
          side: 'sell',
          price: '31000.34',
          size: '8.42',
        }
      ],
    };

    const orderbook = Orderbook();
    orderbook.add(state.bids[0]);
    orderbook.add(state.bids[1]);
    orderbook.add(state.bids[3]);
    orderbook.add(state.bids[2]);
    orderbook.add(state.asks[0]);

    checkState(orderbook.state(), state);
  });

  it('Process limit orders in orderbook', () => {
    const apiState = {
      bids: [
        [39000, 12, 'id-001'],
        [30000, 10, 'id-002'],
      ],
      asks: [
        [32000, 5, 'id-006'],
        [31000, 8, 'id-005'],
      ],
    };

    const expected = [
      {
        price: "39000",
        sellerId: "id-005",
        buyerId: "id-001",
        size: "8"
      }, {
        price: "39000",
        sellerId: "id-006",
        buyerId: "id-001",
        size: "4"
      }
    ]

    const orderbook = Orderbook();
    orderbook.state(apiState);
    orderbook.processOrders();

    // Strip created and id props
    const trades = orderbook.getTrades().map((t: Trade) => {
      const { created, id, ...rest } = t;
      return { ...rest };
    });

    checkState(trades, expected);
  });

  it('Remove orders from orderbook', () => {
    const apiState = {
      bids: [
        [31000, 10, 'id-002'],
        [30000, 7, 'id-001'],
        [29000, 8, 'id-003'],
      ],
      asks: [],
    };

    const state: Book = {
      bids: [
        {
          id: 'id-002',
          side: 'buy',
          price: '31000',
          size: '10',
        },
        {
          id: 'id-001',
          side: 'buy',
          price: '30000',
          size: '7',
        },
        {
          id: 'id-003',
          side: 'buy',
          price: '29000',
          size: '8',
        },
      ],
      asks: [],
    };

    const orderbook = Orderbook();
    orderbook.state(apiState);
    checkState(orderbook.state(), state);

    orderbook.remove('id-003');
    state.bids.splice(2, 1);
    checkState(orderbook.state(), state);
  });

  it('Get an order from orderbook', () => {
    const apiState = {
      bids: [[31000, 10, 'id-002'], [30000, 10, 'id-001']],
      asks: [],
    };

    const expected = {
      id: 'id-002',
      price: '31000',
      size: '10',
      side: 'buy',
    };

    const orderbook = Orderbook();
    orderbook.state(apiState);
    const order = orderbook.get('id-002');

    checkState(order, expected);
  });

  it('Partial match an existing order in orderbook', () => {
    const apiState = {
      bids: [[31000, 10, 'id-002'], [30000, 10, 'id-001'], [28000, 1, 'id-003']],
      asks: [],
    };

    const match: MatchOrder = {
      makerOrderId: 'id-002',
      size: '5',
      price: '31000',
      side: 'buy',
    };

    const expectedState = {
      bids: [
        {
          id: 'id-002',
          side: 'buy',
          price: '31000',
          size: '5',
        },
        {
          id: 'id-001',
          side: 'buy',
          price: '30000',
          size: '10',
        },
        {
          id: 'id-003',
          side: 'buy',
          price: '28000',
          size: '1',
        },
      ],
      asks: [],
    };

    const orderbook = Orderbook();
    orderbook.state(apiState);
    orderbook.match(match);

    checkState(orderbook.state(), expectedState);
  });

  test('Full match order in orderbook', () => {
    const apiState = {
      bids: [[31000, 11, 'id-002'], [30000, 10, 'id-001']],
      asks: [],
    };

    const match: MatchOrder = {
      makerOrderId: 'id-002',
      size: '11',
      price: '31000',
      side: 'buy',
    };

    const expectedState = {
      bids: [
        {
          id: 'id-001',
          side: 'buy',
          price: '30000',
          size: '10',
        },
      ],
      asks: [],
    };

    const orderbook = Orderbook();
    orderbook.state(apiState);
    orderbook.match(match);

    checkState(orderbook.state(), expectedState);
  });

  it('Change an order in orderbook', () => {
    const apiState = {
      bids: [[31000, 8, 'id-002'], [30000, 5, 'id-001']],
      asks: [],
    };

    const change: ChangeOrder = {
      orderId: 'id-002',
      oldSize: '8.0',
      newSize: '3',
      price: '31000',
      side: 'buy',
    };

    const expectedState = {
      bids: [
        {
          id: 'id-002',
          side: 'buy',
          price: '31000',
          size: '3',
        },
        {
          id: 'id-001',
          side: 'buy',
          price: '30000',
          size: '5',
        },
      ],
      asks: [],
    };

    const orderbook = Orderbook();
    orderbook.state(apiState);
    orderbook.update(change);

    checkState(orderbook.state(), expectedState);
  });

  it('Change a market order that doesn\'t exist', () => {
    const apiState = {
      bids: [[30000, 6, 'id-001']],
      asks: [],
    };

    const change: ChangeOrder = {
      orderId: 'id-002',
      side: 'buy',
    };

    const expectedState = {
      bids: [
        {
          id: 'id-001',
          side: 'buy',
          price: '30000',
          size: '6',
        },
      ],
      asks: [],
    };

    const orderbook = Orderbook();
    orderbook.state(apiState);
    orderbook.update(change);

    checkState(orderbook.state(), expectedState);
  });
});
