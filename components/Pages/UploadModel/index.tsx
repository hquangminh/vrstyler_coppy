import { useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import axios, { AxiosError } from 'axios';
import convertFileName from 'common/functions/convertFileName';
import { App, Button, Form, Modal, Space } from 'antd';

import config from 'config';

import useLanguage from 'hooks/useLanguage';
import useWindowSize from 'hooks/useWindowSize';
import useRouterChange from 'hooks/useRouterChange';
import useWarningOnExit from 'hooks/useWarningOnExit';

import { message } from 'lib/utils/message';
import { MovePageEnd } from 'store/reducer/web';

import urlPage from 'constants/url.constant';
import { FilesType } from 'constants/upload-model.constant';

import productServices from 'services/product-services';

import { UploadModelContext } from './Provider';

import NotSupportSmallScreen from '../Dashboard/Fragments/NotSupportSmallScreen';
import ModelPlay from './ModelPlay';
import UploadFile from './File';
import UploadFileInformation from './Information';
import UploadFileBrand from './Brand';
import UploadModelSaveSpinner from './Fragments/SaveSpinner';
import UploadModelProgress from './Fragments/UploadProgress';

import { UserType } from 'models/user.models';

import styled from 'styled-components';
import { ContainerFreeSize } from 'styles/__styles';

type Configs3DViewer = Record<string, string | number> | undefined;

const UploadModel = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { langLabel } = useLanguage();
  const { width: screenW } = useWindowSize();
  const {
    loading,
    user,
    data,
    updateProduct,
    updateCategory,
    updateLicense,
    updateBrand,
    isChange,
    updateFieldChanged,
    avatar,
    updateAvatar,
    onChangeFileType,
    updateFileUploading,
  } = useContext(UploadModelContext);

  const { message: messageApp } = App.useApp();
  const [form] = Form.useForm();

  const [saveType, setSaveType] = useState<'draft' | 'public'>('public');
  const [isHaveFile, setIsHaveFile] = useState<boolean>(false);
  const [urlPlayDemo, setUrlPlayDemo] = useState<string>();
  const [backgroundViewer, setBackgroundViewer] = useState('');
  const [configs3DViewer, setConfigs3DViewer] = useState<Configs3DViewer>(data?.config_3d_viewer);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useWarningOnExit(isChange || submitting, 'Are you sure you want to exit?');

  useRouterChange(
    (path, { shallow }) => {
      if (!shallow && path.includes(urlPage.upload)) {
        form.resetFields();
        setSaveType('public');
        setSubmitting(false);
        updateAvatar(undefined);
        updateProduct(undefined);
        onChangeFileType([]);
        updateFieldChanged(false);
      } else if (shallow) dispatch(MovePageEnd());
    },
    () => undefined
  );

  useEffect(() => {
    if (data && Object.entries(form.getFieldsValue()).every(([_, value]) => !value)) {
      form.setFieldsValue({
        ...data,
        brand_id: data.market_brand?.status ? data.market_brand.id : data.market_brand?.title,
        brand_product_link: data.link,
        brand_product_price: data.sell_price,
        brand_product_sku: data.item_no,
        cat_ids_showroom: data.market_item_category_showrooms?.map((i) => i.market_category.id),
        cat_ids: data.market_item_categories?.map((i) => i.market_category.id),
        free: data.price === 0,
        image: data.image ? [{ name: data.image.split('/').at(-1) }] : undefined,
        old_price: !data.old_price ? undefined : data.old_price,
        price: !data.price ? undefined : data.price,
        quads: data.geometry?.quads,
        tags: data.tags ? data.tags?.split('|') : undefined,
        total_triangles: data.geometry?.total_triangles,
      });
      if (data.files)
        Object.keys(data.files).forEach((key) => {
          const fileValue = form.getFieldValue(key);
          if (fileValue?.[0].name !== data?.files[key].split('/').at(-1))
            form.setFieldValue(key, [{ name: data?.files[key].split('/').at(-1) }]);
        });

      if (FilesType.some((i) => data.files?.[i.key])) setIsHaveFile(true);

      let URLModelViewer = config.urlModelViewer;
      if (data.files?.DEMO) {
        URLModelViewer += '/' + data.id + '?';

        if (data.viewer_bg && !data.config_3d_viewer?.background) {
          URLModelViewer += `background=${data.viewer_bg.split('#')[1]}`;
        }

        if (data.config_3d_viewer)
          for (const key in data.config_3d_viewer) {
            let value = data?.config_3d_viewer[key].toString();
            value = value.startsWith('#') ? value.split('#')[1] : value;
            URLModelViewer += '&' + key + '=' + value;
          }

        setUrlPlayDemo(URLModelViewer);
      } else {
        setUrlPlayDemo(config.urlModelViewer);
      }
    } else setUrlPlayDemo(config.urlModelViewer);
  }, [data, form]);

  useEffect(() => {
    const onChangeEnvironmentModel = (config: Record<string, any>) => {
      if (config.environment || config.lighting || config.background) {
        const { environment: env = 'default', lighting, background } = config;
        const environment = lighting ? 'custom' : env;
        updateFieldChanged(true);
        setConfigs3DViewer((l) => ({ ...l, environment, background, ...lighting }));
        if (background) setBackgroundViewer(background);
      }
    };

    window.addEventListener('message', (e) => onChangeEnvironmentModel(e.data), false);
    return window.removeEventListener('message', (e) => onChangeEnvironmentModel(e.data), false);
  }, [updateFieldChanged]);

  const onChangeValue = async (field: any, allValues: any) => {
    const [key, value] = Object.entries(field)[0];
    const isChangeDescription: boolean =
      key === 'description' &&
      (value !== data?.description || (!value && Boolean(data?.description)));

    if (isChangeDescription || key !== 'description') {
      const isFieldFilled = Object.entries(form.getFieldsValue()).some(([_, value]) => {
        return (Array.isArray(value) && value.length) || Boolean(value);
      });
      updateFieldChanged(isFieldFilled);
    }

    // Check files exit
    setIsHaveFile(FilesType.some((i) => allValues[i.key]?.length));
  };

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      updateFieldChanged(false);

      let bodyProduct = {
        ...values,
        title: values.title.trim().replace(/\s+/g, ' '),
        price: values.price ?? null,
        old_price: values.old_price ?? null,
        status: 5,
        description: values?.description ?? (data?.description ? null : undefined),
        image: avatar?.startsWith('data:image') ? avatar : data?.image,
      };

      if (data?.image && !avatar) bodyProduct['image'] = null;
      if (backgroundViewer) bodyProduct['viewer_bg'] = backgroundViewer;
      if (configs3DViewer) bodyProduct['config_3d_viewer'] = configs3DViewer;
      if (values.free) bodyProduct['price'] = 0;

      if (data && !values.license_id) bodyProduct['license_id'] = null;
      if (values.tags && Array.isArray(values.tags)) bodyProduct['tags'] = values.tags.join('|');

      if (values.quads || values.total_triangles)
        bodyProduct['geometry'] = { quads: values.quads, total_triangles: values.total_triangles };
      else if (data?.geometry) bodyProduct['geometry'] = null;

      if (values.brand_id) bodyProduct['brand_id'] = values.brand_id;
      else if (data?.market_brand) bodyProduct['brand_id'] = null;

      if (values.brand_product_link || values.brand_product_price || values.brand_product_sku)
        bodyProduct['brand'] = {
          link: values.brand_product_link,
          sell_price: values.brand_product_price,
          item_no: values.brand_product_sku,
        };
      else if (data)
        bodyProduct['brand'] = {
          link: values.brand_product_link ?? null,
          sell_price: values.brand_product_price ?? null,
          item_no: values.brand_product_sku ?? null,
        };

      delete bodyProduct['DEMO'];
      delete bodyProduct['free'];
      delete bodyProduct['quads'];
      delete bodyProduct['total_triangles'];
      delete bodyProduct['brand_product_link'];
      delete bodyProduct['brand_product_price'];
      delete bodyProduct['brand_product_sku'];
      FilesType.forEach((i) => delete bodyProduct[i.key]);

      // 3D files initial
      let productFiles: { [key: string]: string } = { ...data?.files };
      for (const key in data?.files) {
        if (!values[key]?.length) delete productFiles[key];
      }
      if (data) {
        if (productFiles['GLB']) productFiles['USDZ'] = data.files['USDZ'];
        if (productFiles['DEMO']) productFiles['DEMO_USDZ'] = data.files['DEMO_USDZ'];
      }

      let productFileDetails: string[] = data?.file_details ? [...data.file_details] : [];

      productFileDetails.forEach((fileName) => {
        if (!values[fileName]?.length)
          productFileDetails = [...productFileDetails].filter((i) => i !== fileName);
      });
      if (productFileDetails.includes('GLB') && data?.file_details?.includes('USDZ'))
        productFileDetails.push('USDZ');

      // List file upload
      let files3D: { name: string; value: any }[] = [];

      if (values.DEMO?.length && values.DEMO[0].originFileObj)
        files3D.push({ name: 'DEMO', value: values.DEMO });

      FilesType.filter((i) => values[i.key]).forEach((i) => {
        if (values[i.key]?.length && values[i.key][0].originFileObj)
          files3D.push({ name: i.key, value: values[i.key] });
      });

      if (saveType === 'public' && files3D.length === 0) bodyProduct['status'] = 1;
      let isFileChanged = false;

      const resProduct = !data
        ? await productServices.addProduct(bodyProduct)
        : await productServices.updateProduct(data.id, {
            ...bodyProduct,
            files: Object.keys(productFiles).length ? productFiles : null,
            file_details: productFileDetails.length ? productFileDetails : null,
          });

      if (!data) {
        updateProduct(resProduct.data);
        await router.replace('/upload-model/' + resProduct.data.id, undefined, { shallow: true });
      }
      if (resProduct.data.image) updateAvatar(resProduct.data.image);

      let isError: boolean = false;
      let completedPromises = 0;

      if (files3D.length > 0) {
        // Upload file
        updateFileUploading(
          files3D.map((i) => {
            const name = convertFileName(i.value[0].name);
            return { type: i.name, name, percent: 0 };
          })
        );
        await Promise.all(
          files3D.map(async (file) => {
            try {
              const filename = convertFileName(file.value[0].name);
              const resLinkS3 = await productServices.getLinkS3({
                filename,
                kind: file.name === 'DEMO' ? 'public' : 'private',
              });

              if (resLinkS3.upload) {
                await axios
                  .put(resLinkS3.upload, file.value[0].originFileObj, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 1000 * 99999999,
                    transformRequest: (data, headers: any) => {
                      delete headers.common['Authorization'];
                      return data;
                    },
                    onUploadProgress: (progressEvent) => {
                      const percent = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                      );
                      updateFileUploading((current) => {
                        const list = [...current];
                        const orderItem = list.findIndex((i) => i.type === file.name);
                        if (orderItem !== -1) {
                          list.splice(orderItem, 1, { ...list[orderItem], percent });
                        }
                        return list;
                      });
                    },
                  })
                  .then(async () => {
                    productFiles[file.name] = resLinkS3.download;
                    if (file.name !== 'DEMO') productFileDetails.push(file.name);
                    isFileChanged = true;
                    if (file.name === 'DEMO' && resLinkS3.download_usdz)
                      productFiles['DEMO_USDZ'] = resLinkS3.download_usdz;
                    if (file.name === 'GLB' && resLinkS3.download_usdz) {
                      productFiles['USDZ'] = resLinkS3.download_usdz;
                      productFileDetails.push('USDZ');
                    }

                    await productServices
                      .updateProduct(resProduct.data.id, {
                        files: productFiles,
                        file_details: productFileDetails,
                        status: 5,
                      })
                      .then((resp) => {
                        if (resp.data) {
                          completedPromises++;
                          updateProduct((product) => ({ ...product, ...resp.data }));
                          form.setFieldValue(file.name, [{ name: filename }]);
                        }
                      });
                  })
                  .catch(() => {
                    updateFileUploading((current) => {
                      const list = [...current];
                      const orderItem = list.findIndex((i) => i.type === file.name);
                      if (orderItem !== -1)
                        list.splice(orderItem, 1, { ...list[orderItem], error: true });

                      return list;
                    });
                    form.setFieldValue(file.name, undefined);
                    isError = true;
                  });
              } else {
                form.setFieldValue(file.name, undefined);
                isError = true;
              }
            } catch (error) {
              console.error('354', error);
            }
          })
        );
      }

      if (isError) {
        await form
          .validateFields()
          .catch(({ errorFields }) => onScrollToValidate('field-item-' + errorFields[0].name[0]))
          .finally(() => updateFileUploading([]));
      } else {
        const paramUpload = {
          brand_id: values.brand_id,
          cat_ids_showroom: values.cat_ids_showroom,
          cat_ids: values.cat_ids,
          file_details: productFileDetails,
          files: productFiles,
          image: resProduct.data.image ?? data?.image,
          license_id: values.license_id,
          old_price: values.old_price ?? null,
          price: values.free ? 0 : values.price,
          status: saveType === 'public' ? 1 : 5,
          title: values.title,
        };

        if (isFileChanged) await productServices.updateProduct(resProduct.data.id, paramUpload);

        flushSync(() => setSubmitting(false));
        updateFileUploading([]);
        onFinalSuccess();
      }
    } catch (error: any) {
      setSubmitting(false);
      updateFileUploading([]);
      if ((error as AxiosError)?.response?.status !== 401) {
        message.destroy();
        messageApp.error('An error occurred, please try again!');
        updateFieldChanged(true);

        if (error instanceof AxiosError && error.response?.data.listError) {
          let formFieldError = '';
          for (const { error_code, list_id_error } of error.response.data.listError) {
            if (error_code === 'CATEGORY_NOT_EXIST') {
              if (!formFieldError) formFieldError = 'field-item-cat_ids';
              updateCategory((current) => current?.filter(({ id }) => !list_id_error.includes(id)));
            }
            if (error_code === 'LICENSE_NOT_EXIST') {
              if (!formFieldError) formFieldError = 'field-item-license_id';
              updateLicense((current) => current?.filter(({ id }) => id !== values.license_id));
            }
            if (error_code === 'BRAND_NOT_EXIST') {
              if (!formFieldError) formFieldError = 'field-item-brand_id';
              updateBrand((current) => current?.filter(({ id }) => id !== values.brand_id));
            }
          }
          onScrollToValidate(formFieldError);
        }
      }
    }
  };

  const onFinalSuccess = () => {
    if (saveType === 'public') messageApp.success(langLabel.upload_modal_success);
    else messageApp.success(langLabel.upload_modal_draft_success);
    goToDashboardModel();
  };

  const handelHideProduct = () => {
    Modal.confirm({
      title: 'Are you sure you want to hide this product?',
      content: (
        <>
          This only hides the product and doesn&apos;t change any information.
          <br />
          <span style={{ color: '#ff4d4f' }}>
            You will not be able to change the product once it is hidden.
          </span>
        </>
      ),
      centered: true,
      width: 480,
      onOk: () => {
        setSubmitting(true);
        updateFieldChanged(false);
        productServices
          .updateProduct(data?.id ?? '', { status: 7 })
          .then(() => {
            flushSync(() => setSubmitting(false));
            messageApp.success('The product has been hidden');
            goToDashboardModel();
          })
          .catch(() => setSubmitting(false));
      },
    });
  };

  const goToDashboardModel = (isCancel?: boolean) => {
    if (saveType === 'public' && !data?.publish_date && !isCancel) {
      router.push({
        pathname: '/dashboard/models',
        query: { sort_by: 'publish_date-desc_nulls_last' },
      });
    } else router.push('/dashboard/models');
  };

  const onScrollToValidate = (id: string, smooth: boolean = false) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: smooth ? 'smooth' : undefined });
    }
  };

  if (screenW > 0 && screenW < 992) return <NotSupportSmallScreen />;

  return (
    <Wrapper>
      {submitting && <UploadModelSaveSpinner />}
      <ContainerFreeSize>
        <Form
          form={form}
          layout='vertical'
          onValuesChange={onChangeValue}
          onFinish={onSubmit}
          onFinishFailed={({ errorFields }) =>
            onScrollToValidate('field-item-' + errorFields[0].name[0])
          }>
          <ModelPlay url={urlPlayDemo ?? ''} />
          <UploadFile
            saveType={saveType}
            isHaveFile={isHaveFile}
            onChangeHaveFile={setIsHaveFile}
          />
          <UploadFileInformation saveType={saveType} />
          {(user?.is_vrstyler || user?.type === UserType.VRSTYLER) && <UploadFileBrand />}

          <ActionGroup>
            <Button danger onClick={() => goToDashboardModel(true)}>
              Cancel
            </Button>
            {!loading && (
              <Space size={20}>
                {data?.market_items_boughts_aggregate &&
                  data.market_items_boughts_aggregate.aggregate.count > 0 && (
                    <Button
                      type='primary'
                      danger
                      loading={submitting}
                      disabled={submitting || data.status === 7}
                      onClick={handelHideProduct}>
                      Hide
                    </Button>
                  )}

                {!data?.market_items_boughts_aggregate?.aggregate.count && (
                  <Button
                    type='primary'
                    ghost
                    loading={saveType === 'draft' && submitting}
                    disabled={
                      (saveType === 'public' && submitting) || (data?.status === 5 && !isChange)
                    }
                    onClick={() => {
                      setSaveType('draft');
                      form.submit();
                    }}>
                    Save as Draft
                  </Button>
                )}
                <Button
                  type='primary'
                  loading={saveType === 'public' && submitting}
                  disabled={
                    (saveType === 'draft' && submitting) ||
                    (!isChange && data && ![5, 7].includes(data.status))
                  }
                  onClick={() => {
                    setSaveType('public');
                    form.submit();
                  }}>
                  Save & Publish
                </Button>
              </Space>
            )}
          </ActionGroup>
        </Form>
      </ContainerFreeSize>

      <UploadModelProgress />
    </Wrapper>
  );
};

export default UploadModel;

const Wrapper = styled.main`
  padding: 30px 0;

  .ant-form {
    z-index: 1;
  }

  .ant-form-item .ant-form-item-label {
    &:has(span[aria-label='info-circle']) {
      overflow: unset;
    }
    label {
      flex-direction: row !important;
      gap: 5px;
      color: var(--color-gray-9);
      &::before {
        margin: 0;
      }
    }

    overflow: initial;
  }

  .ant-modal-confirm-btns {
    margin-top: 0;
    .ant-btn {
      margin-top: 10px;
      .anticon {
        display: none;
      }
      span {
        margin-left: 0;
      }
      & + .ant-btn {
        margin-left: 16px;
      }
      &.btn-close {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        margin-top: 0;
        padding: 10px;
        height: auto;
        border: none;
        box-shadow: none;
        span {
          display: none;
        }
        .anticon {
          display: inline-block;
        }
      }
    }
  }
`;
const ActionGroup = styled.div`
  position: sticky;
  bottom: 0;

  display: flex;
  justify-content: space-between;

  padding: 20px 50px;
  background-color: #ffffff;
  box-shadow: 0 4px 30px 0 rgba(0, 0, 0, 0.1);
  z-index: 3;
`;
