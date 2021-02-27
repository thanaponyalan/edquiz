import withMiddleware from "../../middlewares";
import googleMiddleware from '../../middlewares/google';

export default withMiddleware(googleMiddleware.updateToken);