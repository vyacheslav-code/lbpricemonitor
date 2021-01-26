import { useState, useEffect } from "react";
import { Table } from "antd";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const novusFetch = await fetch(
        "https://stores-api.zakaz.ua/stores/48201030/categories/buckwheat/products"
      );
      const ekoMarketFetch = await fetch(
        "https://stores-api.zakaz.ua/stores/48280187/categories/pulses-and-grain-ekomarket/products"
      );
      const auchanFetch = await fetch(
        "https://stores-api.zakaz.ua/stores/48246418/categories/buckwheat-auchan/products"
      );

      const novusData = await novusFetch.json();
      const ekoMarketData = await ekoMarketFetch.json();
      const auchanData = await auchanFetch.json();

      const formatData = (rawData, shop) =>
        rawData.results
          .filter((result) => !!result.producer.trademark)
          .map((result) => ({
            shop,
            title: result.title,
            weight: result.weight,
            price: result.price / 100,
            producerName: result.producer.trademark,
            producerLogo: result.producer.logo.s32x32,
            img: result.img.s150x150,
          }));

      setData([
        ...formatData(novusData, "Novus"),
        ...formatData(ekoMarketData, "Eko-Market"),
        ...formatData(auchanData, "Auchan"),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const shopFilters = [
    {
      text: "Novus",
      value: "Novus",
    },
    {
      text: "Eko-Market",
      value: "Eko-Market",
    },
    {
      text: "Auchan",
      value: "Auchan",
    },
  ];

  const generateWeightFilters = (key) => {
    if (data.length) {
      const dataValuesByKey = data.map((el) => el[key]);
      return [...new Set(dataValuesByKey)].map((filter) => ({
        text: filter,
        value: filter,
      }));
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      fixed: "left",
      render: (text, record) => (
        <>
          <p>{text}</p>
          <img src={record.img} width={64} height={64} />
        </>
      ),
    },
    {
      title: "Shop",
      dataIndex: "shop",
      filters: shopFilters,
      onFilter: (value, record) => record.shop.indexOf(value) === 0,
    },
    {
      title: "W-t, g",
      dataIndex: "weight",
      filters: generateWeightFilters("weight"),
      onFilter: (value, record) => record.weight === value,
      sorter: (a, b) => a.weight - b.weight,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Producer",
      dataIndex: "producerName",
      render: (text, record) => (
        <>
          <p>{text}</p>
          <img src={record.producerLogo} />
        </>
      ),
      filters: generateWeightFilters("producerName"),
      onFilter: (value, record) => record.producerName.indexOf(value) === 0,
    },
    {
      title: "Price, UAH",
      dataIndex: "price",
      fixed: "right",
      sorter: (a, b) => a.price - b.price,
      sortDirections: ["ascend", "descend"],
    },
  ];
  return (
    <div className="app-container">
      <h1>Los Bodganos Grechka Price Monitoring</h1>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loading}
        bordered
        scroll={{ y: window.innerHeight - 297, x: true }}
      />
    </div>
  );
}

export default App;
