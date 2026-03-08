import webRouter from "./webRouter";
import MobileRouter from "./mobileRouter";

const isMobile = window.innerWidth <= 768;
const router = isMobile ? MobileRouter : webRouter;
export default router;
