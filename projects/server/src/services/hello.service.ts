import { Hello } from '@/interfaces/hello.interface';
import { Service } from 'typedi';

@Service()
export class HelloService {
  public async sayHello(): Promise<Hello> {
    return {
      message: 'Hallo from Backend',
    };
  }
}
