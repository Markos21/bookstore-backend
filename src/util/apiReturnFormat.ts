import { Response } from 'express';

export const apiReturnFormat = {
  success: (res: Response, message: string = 'Success', data?: any) => {
    res.status(200).json({
      status: 200,  
      result: true,
      message: message,
      data: data || null,
    });
  },

  error: (res: Response, message: string = 'Error', error: any = null) => {
    res.status(200).json({
      status: 400, 
      result: false,
      message: message,
      error: error,
    });
  },
   noContent(res: Response, message: string): void {
    res.status(204).json({
      result: true,
      message,
      data: null,
    });
  },

   notFound(res: Response, message: string): void {
    res.status(200).json({
      result: false,
      message,
      data: null,
    });
  },
  exception: (res: Response, error: Error) => {
    res.status(500).json({
      status: 500,  
      result: false,
      message: error||'Internal Server Error',
      error: error.message || 'Unknown Error',
    });
  },
};
