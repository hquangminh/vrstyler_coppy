import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { handlerMessage } from 'common/functions';

import useLanguage from 'hooks/useLanguage';

import showroomServices from 'services/showroom-services';

import TableComponent from './Table';
import CategoryShowroom from 'components/Pages/UploadModel/Fragments/CategoryShowroom';

import { CategoryModel } from 'models/category.models';

import * as L from './style';

const ShowroomCategoryComponent = () => {
  const { langLabel, t } = useLanguage();
  const [categories, setCategories] = useState<{ total: number; data: CategoryModel[] | null }>({
    data: null,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [listChecked, setListChecked] = useState<string[]>([]);
  const [openAddCategory, setOpenAddCategory] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);

      try {
        const resp = await showroomServices.getAllCategory();
        if (!resp.error) {
          setCategories({ data: resp.data, total: resp.data.length });
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  const fetchDeleteCategory = async () => {
    try {
      const resp = await showroomServices.deleteCategory(listChecked);

      if (!resp.error) {
        setCategories((prevState) => ({
          total:
            (prevState.data && prevState.data.filter((p) => !listChecked.includes(p.id)).length) ||
            0,
          data: prevState.data && prevState.data.filter((p) => !listChecked.includes(p.id)),
        }));
        handlerMessage(langLabel.message_delete_success, 'success');
        setListChecked([]);
      }
    } catch (error: any) {
      console.log('Del Category', error);
    }
  };

  const onChecked = (e: CheckboxChangeEvent, id: string) => {
    if (e.target.checked) {
      setListChecked((prevState) => [...prevState, id]);
    } else {
      setListChecked((prevState) => prevState.filter((c) => c !== id));
    }
  };

  const onAddCategory = (category: CategoryModel) => {
    setCategories((prevState) => ({
      ...prevState,
      total: prevState.total + 1,
      data: prevState.data ? [...prevState.data, category] : [category],
    }));
  };

  return (
    <L.ShowroomCategory_Wrapper>
      <div className='header__wrapper'>
        <h3>
          {langLabel.total || 'Total'} <span className='total'>{categories.total} </span>
          {categories.total <= 1 && categories.total !== 0
            ? langLabel.category?.toLowerCase() || 'category'
            : langLabel.categories?.toLowerCase() || 'categories'}
        </h3>

        <div className='btn__group'>
          {listChecked.length > 0 ? (
            <>
              <Button
                className='btn__delete'
                type='primary'
                onClick={() =>
                  Modal.confirm({
                    title:
                      listChecked.length > 1
                        ? langLabel.dashboard_category_confirm_delete_multiple
                        : langLabel.dashboard_category_confirm_delete,
                    centered: true,
                    okText: langLabel.btn_confirm,
                    cancelText: langLabel.btn_cancel,
                    onOk: fetchDeleteCategory,
                    autoFocusButton: null,
                  })
                }>
                {langLabel.btn_delete}
              </Button>

              <Button className='btn__add' type='primary' onClick={() => setListChecked([])}>
                {t('dashboard_category_unchecked')}
              </Button>
            </>
          ) : (
            <Button className='btn__add' type='primary' onClick={() => setOpenAddCategory(true)}>
              {langLabel.dashboard_add_category_title}
            </Button>
          )}
        </div>
      </div>

      <CategoryShowroom
        open={openAddCategory}
        onAddCategory={onAddCategory}
        onClose={() => setOpenAddCategory(false)}
      />

      <TableComponent
        setListChecked={setListChecked}
        loading={loading}
        categories={categories}
        onChecked={onChecked}
        listChecked={listChecked}
      />
    </L.ShowroomCategory_Wrapper>
  );
};

export default ShowroomCategoryComponent;
