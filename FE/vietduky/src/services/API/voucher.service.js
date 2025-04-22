import restClient from "../restClient";

export const VoucherService = {
    getAllVouchers: () => {
        return restClient({
            url: "voucher",
            method: "GET",
        });
    },
    getVoucher: (id) => {
        return restClient({
            url: `voucher/${id}`,
            method: "GET",
        });
    },
    getVoucherByCode: (code) => {
        return restClient({
            url: `voucher/code/${code}`,
            method: "GET",
        });
    }
};