import authRoutes from './auth';
import ordersRoutes from './orders';

const routes = [...ordersRoutes, ...authRoutes];

export default routes;
