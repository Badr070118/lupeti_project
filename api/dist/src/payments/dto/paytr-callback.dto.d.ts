export declare class PaytrCallbackDto {
    merchant_oid: string;
    status: string;
    total_amount: string;
    hash: string;
    failed_reason_msg?: string;
    failed_reason_code?: string;
    payment_type?: string;
}
