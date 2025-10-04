import { doubleCsrf } from "csrf-csrf";
import { doubleCsrfUtilities  } from '../config';

const { doubleCsrfProtection: scrfProtection } =
  doubleCsrf(doubleCsrfUtilities)

export { scrfProtection }