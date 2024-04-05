import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Result, Spin } from 'antd';

import useLanguage from 'hooks/useLanguage';
import useRouterChange from 'hooks/useRouterChange';

import { message } from 'lib/utils/message';

import urlPage from 'constants/url.constant';

import brandsServices from 'services/brands-services';
import categoryServices from 'services/category-services';
import licenseServices from 'services/license-services';
import sellerServices from 'services/seller-services';
import showroomServices from 'services/showroom-services';

import { BrandModel } from 'models/showroom.models';
import { CategoryModel } from 'models/category.models';
import { FormFile3D } from 'models/upload-model.models';
import { LicenseModel } from 'models/license.models';
import { ProductModel } from 'models/product.model';
import { UserModel, UserType } from 'models/user.models';

type UploadItem = { type: string; name: string; percent: number; error?: boolean };

type ContextValue = {
  user?: UserModel;
  loading: boolean;
  data?: ProductModel;
  updateProduct: Dispatch<SetStateAction<ProductModel | undefined>>;
  license?: LicenseModel[];
  updateLicense: Dispatch<SetStateAction<LicenseModel[] | undefined>>;
  category?: CategoryModel[];
  updateCategory: Dispatch<SetStateAction<CategoryModel[] | undefined>>;
  brand?: BrandModel[];
  updateBrand: Dispatch<SetStateAction<BrandModel[] | undefined>>;
  categoryShowroom?: CategoryModel[];
  updateCategoryShowroom: Dispatch<SetStateAction<CategoryModel[] | undefined>>;
  isChange: boolean;
  updateFieldChanged: Dispatch<SetStateAction<boolean>>;
  avatar?: string;
  updateAvatar: Dispatch<SetStateAction<string | undefined>>;
  filesType: FormFile3D[];
  onChangeFileType: Dispatch<SetStateAction<FormFile3D[]>>;
  fileUploading: UploadItem[];
  updateFileUploading: Dispatch<SetStateAction<UploadItem[]>>;
};

export const UploadModelContext = createContext<ContextValue>({} as ContextValue);

const UploadModelProvider = (props: { me: UserModel; productID?: string; children: ReactNode }) => {
  const { productID, children } = props;
  const i18n = useLanguage();

  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductModel>();
  const [category, setCategory] = useState<CategoryModel[]>();
  const [license, setLicense] = useState<LicenseModel[]>();
  const [brand, setBrand] = useState<BrandModel[]>();
  const [categoryShowroom, setCategoryShowroom] = useState<CategoryModel[]>();
  const [isChange, setIsChange] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>();
  const [filesType, setFilesType] = useState<FormFile3D[]>([]);
  const [fileUploading, setFileUploading] = useState<UploadItem[]>([]);

  useRouterChange(
    (path) => (isError ? setIsError(!path.endsWith(urlPage.upload)) : undefined),
    () => undefined
  );

  const fetchData = useCallback(() => {
    const fetchProduct = productID ? sellerServices.productDetail(productID) : undefined;
    const fetchCategory = categoryServices.getAllCategory();
    const fetchLicense = licenseServices.getList();
    const fetchCategoryShowroom =
      props.me.type === UserType.SHOWROOM
        ? showroomServices.getCategory({ params: { status: true } })
        : undefined;
    const fetchBrand =
      props.me.is_vrstyler || props.me.type === UserType.VRSTYLER
        ? brandsServices.listBrands({ offset: 0, limit: 999, params: { status: true } })
        : undefined;
    Promise.all([fetchProduct, fetchCategory, fetchLicense, fetchCategoryShowroom, fetchBrand])
      .then(([product, category, license, categoryShowroom, brand]) => {
        setProduct(product?.data);
        setAvatar(product?.data.image);
        setCategory(category.data);
        setLicense(license.data);
        setCategoryShowroom(categoryShowroom?.data);
        setBrand(brand?.data);
      })
      .catch(() => {
        message.destroy();
        setIsError(true);
      })
      .finally(() => setLoading(false));
  }, [productID, props.me]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value: ContextValue = useMemo(
    () => ({
      loading,
      user: props.me,
      data: product,
      updateProduct: setProduct,
      license,
      updateLicense: setLicense,
      category,
      updateCategory: setCategory,
      brand,
      updateBrand: setBrand,
      categoryShowroom,
      updateCategoryShowroom: setCategoryShowroom,
      isChange,
      updateFieldChanged: setIsChange,
      avatar,
      updateAvatar: setAvatar,
      filesType,
      onChangeFileType: setFilesType,
      fileUploading,
      updateFileUploading: setFileUploading,
    }),
    [
      avatar,
      brand,
      category,
      categoryShowroom,
      fileUploading,
      filesType,
      isChange,
      license,
      loading,
      product,
      props.me,
    ]
  );

  return (
    <UploadModelContext.Provider value={value}>
      <Spin spinning={loading} tip='Fetching data'>
        {!isError && children}
        {isError && (
          <Result
            status='404'
            title='Oops!'
            subTitle={i18n.t('product_detail_not_found_description')}
            style={{ paddingBlock: 100 }}
          />
        )}
      </Spin>
    </UploadModelContext.Provider>
  );
};

export default UploadModelProvider;
