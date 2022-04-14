import { Body, Controller, Post } from '@nestjs/common';
import { STRIPE_SECRET_KEY } from 'src/configs/stripe.config';
import { User } from 'src/libs/decorators/user.decorator';
import { IIAMUser, IPaymentStatus } from 'src/utils/types';
import Stripe from 'stripe';
import { OrderService } from '../order/order.service';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

@Controller('payment')
export class PaymentController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async createPayment(@User() iamUser: IIAMUser, @Body() req: any) {
    const { amount, id, orderDetail } = req;
    try {
      const payment = await stripe.paymentIntents.create({
        amount,
        payment_method: id,
        currency: 'vnd',
        description: JSON.stringify(orderDetail),
        confirm: true,
      });

      if (payment?.status === 'succeeded') {
        await this.orderService.createOrder(iamUser, {
          ...orderDetail,
          paymentStatus: IPaymentStatus.Success,
        });
      }
      return true;
    } catch (error) {
      return false;
    }

    return false;
  }
}
