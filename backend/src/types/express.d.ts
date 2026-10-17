declare global {
  namespace Express {
    interface Request {
      /** Preenchido pelo middleware `authenticate`. */
      userId?: string;
    }
  }
}

export {};
