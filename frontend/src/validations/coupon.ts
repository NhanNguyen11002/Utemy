import * as Yup from "yup";
import constants from "../constants";

export const createCouponValidationSchema = Yup.object({
    code: Yup.string().trim().required(constants.error.ERROR_CODE_REQUIRED).max(30, constants.error.ERROR_CODE_MAX).min(8, constants.error.ERROR_CODE_MIN),
    discount: Yup.number()
        .positive()
        .required(constants.error.ERROR_DISCOUNT_REQUIRED)
        .moreThan(0, constants.error.ERROR_DISCOUNT_MIN)
        .lessThan(100, constants.error.ERROR_DISCOUNT_MAX),
    remain_quantity: Yup.number().positive().required(constants.error.ERROR_REMAIN_QUANTITY_REQUIRED),
    valid_start: Yup.date()
        .required(constants.error.ERROR_VALID_START_REQUIRED), // Ensure valid_start is required
    valid_until: Yup.date()
        .min(Yup.ref('valid_start'), constants.error.ERROR_VALID_UNTIL_LATER_VALID_START)
        .required(constants.error.ERROR_VALID_UNTIL_REQUIRED), // Ensure valid_until is required
});

export const editCouponValidationSchema = Yup.object({
  code: Yup.string().trim().required(constants.error.ERROR_CODE_REQUIRED).max(30, constants.error.ERROR_CODE_MAX).min(8, constants.error.ERROR_CODE_MIN),
  discount: Yup.number()
      .positive()
      .required(constants.error.ERROR_DISCOUNT_REQUIRED)
      .moreThan(0, constants.error.ERROR_DISCOUNT_MIN)
      .lessThan(100, constants.error.ERROR_DISCOUNT_MAX),
  remain_quantity: Yup.number().positive().required(constants.error.ERROR_REMAIN_QUANTITY_REQUIRED),
  valid_start: Yup.date()
      .required(constants.error.ERROR_VALID_START_REQUIRED), // Ensure valid_start is required
  valid_until: Yup.date()
      .min(Yup.ref('valid_start'), constants.error.ERROR_VALID_UNTIL_LATER_VALID_START)
      .required(constants.error.ERROR_VALID_UNTIL_REQUIRED), // Ensure valid_until is required
});