import { AxiosError } from 'axios';
import { message } from './message';
import checkoutServices from 'services/checkout-services';
import { ProductModel } from 'models/product.model';

export const AddToCart = async (currentData: ProductModel, langLabel: Record<string, string>) => {
  try {
    const { error, message: msg, data } = await checkoutServices.addToCart(currentData.id);
    data.isProductChange =
      currentData.title !== data.market_item?.title ||
      currentData.price !== data.market_item?.price ||
      currentData.image !== data.market_item?.image ||
      currentData.old_price !== data.market_item?.old_price;

    message.success(langLabel.message_add_to_cart_success);

    return { error, message: msg, data };
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status !== 401) {
      message.destroy(error.response?.data.error_code);
      message.error({
        key: error.response?.data.error_code + '_' + currentData.id,
        content: langLabel[error.response?.data.error_code],
      });
    }
    return { error: true };
  }
};

export const RemoveProductCart = async (productCartId: string) => {
  try {
    const { error, message } = await checkoutServices.removeProductCart(productCartId);
    return { error, message };
  } catch (error: any) {
    return { error: true };
  }
};
