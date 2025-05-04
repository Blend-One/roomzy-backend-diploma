import { ApiProperty } from '@nestjs/swagger';

export class CheckoutURLDto {
    @ApiProperty({
        type: String,
        example:
            'https://checkout.stripe.com/c/pay/cs_test_a1RE2dw5Hpk2zshtPngrUF8RCX6ntyLa9Fp0dg0DGaPwyt1tGy5msb8WHc#fidkdWxOYHwnPyd1blpxYHZxWjA0V0JMTDNUYT1VRG1JdnN2R1V1MXRyM2tpT3ZHR3B9QHBTNXRsUkk9V0l%2FQGc8Vj1USkpCS2pXcTZWan1OSVNoR1xfMmdLTkt0cWhfc1U1NnFgPEhAb1c9NTVVNGRRNV1SZCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
        description: 'Url to proceed with checkout flow',
    })
    sessionUrl: string;
}
