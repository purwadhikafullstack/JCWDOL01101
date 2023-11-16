import { Hello } from '@/interfaces/hello.interface';
import { HelloService } from '@/services/hello.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

export class HelloController {
  public hello = Container.get(HelloService);

  public greeting = async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    try {
      const data: Hello = await this.hello.sayHello();
      // console.log(req.auth);
      res.status(201).json({
        data,
        message: 'greeting',
      });
    } catch (error) {
      next(error);
    }
  };
}
