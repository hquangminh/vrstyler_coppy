import React, { useCallback, useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, Radio, Spin } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import useLanguage from 'hooks/useLanguage';
import { dateFormat } from 'lib/helpers/formatDate';
import sellerServices from 'services/seller-services';

import { StatisticalModel } from 'models/seller.model';

import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip);

type Filter = { type: number; start_date?: string | Date; end_date?: string | Date };
type RangeValue = [Dayjs | null, Dayjs | null] | null;

const ChartComponent = () => {
  const { langCode, langLabel, t } = useLanguage();

  const [loading, setLoading] = useState<boolean>(true);
  const [dates, setDates] = useState<RangeValue>(null);
  const [dataChart, setDataChart] = useState<StatisticalModel[] | null>(null);
  const [filter, setFilter] = useState<Filter>({ type: 1 });

  const fetchDataChart = useCallback(async () => {
    try {
      setLoading(true);

      const { type, start_date, end_date } = filter;

      if (type === 4 && !start_date && !end_date) setDataChart(null);
      else await sellerServices.getStatistical(filter).then(({ data }) => setDataChart(data));

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchDataChart();
  }, [fetchDataChart]);

  const disabledDate = (current: Dayjs) => {
    if (!dates) return false;
    return current > dayjs(dates[0]).add(1, 'month') || current < dayjs(dates[1]).add(-1, 'month');
  };

  const showChart = !loading && dataChart?.some((i) => i.value >= 0);
  const isEmpty = !loading && !dataChart?.some((i) => i.value >= 0);
  const sumValue = [...(dataChart ?? [])].reduce((sum, item) => sum + item.value, 0);
  const valueMax = [...(dataChart ?? [])]?.sort((a, b) => b.value - a.value)[0]?.value ?? 0;
  const valueAvg = Number((sumValue / (dataChart?.length ?? 0)).toFixed(0));
  const chartMax = Number((valueMax + valueAvg).toFixed(0));
  const lineMaxY = chartMax < 5 ? 5 : chartMax % 2 ? chartMax + 1 : chartMax;

  return (
    <>
      <FilterBoxWrapper>
        <Radio.Group
          value={filter.type}
          disabled={loading}
          onChange={(e) => setFilter({ type: e.target.value })}>
          <Radio.Button value={1}>{langLabel.month}</Radio.Button>
          <Radio.Button value={3}>{langLabel.week}</Radio.Button>
          <Radio.Button value={4}>{langLabel.custom}</Radio.Button>
        </Radio.Group>

        {filter.type === 4 && (
          <DatePicker.RangePicker
            className='date-picker-range-chart'
            getPopupContainer={(triggerNode) => triggerNode}
            disabledDate={disabledDate}
            inputReadOnly
            value={
              filter.start_date && filter.end_date
                ? [dayjs(filter.start_date), dayjs(filter.end_date)]
                : [null, null]
            }
            onOpenChange={() => !dates?.[0] && setDates(null)}
            onCalendarChange={(dates) => setDates(dates)}
            onChange={(value) =>
              setFilter((s) => ({
                ...s,
                start_date: value ? value[0]?.format() : undefined,
                end_date: value ? value[1]?.format() : undefined,
              }))
            }
          />
        )}
      </FilterBoxWrapper>
      {loading && (
        <EmptyWrapper>
          <Spin />
        </EmptyWrapper>
      )}
      {showChart && (
        <Line
          style={{ width: '100%' }}
          options={{
            scales: {
              x: { grid: { display: false }, ticks: { maxTicksLimit: 15 } },
              y: { ticks: { maxTicksLimit: 10 }, min: 0, max: lineMaxY },
            },
            interaction: { mode: 'index' as const, intersect: false },
            aspectRatio: 4,
          }}
          data={{
            labels: dataChart?.map((i) => dateFormat(i.time, langCode)),
            datasets: [
              {
                label: t('modeling_product'),
                data: dataChart?.map((i) => i.value),
                fill: true,
                borderColor: '#369ca5',
                borderWidth: 1,
                pointRadius: 1.5,
                backgroundColor: 'rgba(54, 156, 165, 0.1)',
              },
            ],
          }}
        />
      )}
      {isEmpty && (
        <EmptyWrapper>{t('dashboard_general_statistical_empty', 'No Statistical')}</EmptyWrapper>
      )}
    </>
  );
};

export default ChartComponent;

const FilterBoxWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  .ant-select {
    width: 250px;
  }
  .date-picker-range-chart .ant-picker-cell-in-view.ant-picker-cell-range-end {
    pointer-events: auto;
  }
`;

const EmptyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 576px;
`;
