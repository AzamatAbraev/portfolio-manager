import { Fragment, memo, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Space,
  Table,
} from "antd";

import {
  useCreatePortfolioMutation,
  useDeletePortfolioMutation,
  useGetPortfolioMutation,
  useGetPortfoliosQuery,
  useUpdatePortfolioMutation,
  useUploadPhotoMutation,
} from "../../../redux/queries/portfolio";

import { Link } from "react-router-dom";
import { getImage } from "../../../utils/getImage";
import { LIMIT } from "../../../constants";

import "./style.scss";

const PortfoliosPage = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const {
    data: { portfolios, total } = { portfolios: [], total: 0 },
    isFetching,
    refetch,
  } = useGetPortfoliosQuery({ page, search, limit: LIMIT });

  const [uploadPhoto] = useUploadPhotoMutation();
  const [createPortfolio] = useCreatePortfolioMutation();
  const [getPortfolio] = useGetPortfolioMutation();
  const [updatePortfolio] = useUpdatePortfolioMutation();
  const [deletePortfolio] = useDeletePortfolioMutation();

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      setIsModalLoading(true);
      const values = await form.validateFields();
      values.photo = photo._id;
      if (selected === null) {
        await createPortfolio(values);
      } else {
        await updatePortfolio({ id: selected, body: values });
      }
      refetch();
      setIsModalOpen(false);
      form.resetFields();
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setSelected(id);
    setIsModalOpen(true);
    const { data } = await getPortfolio(id);
    setPhoto(data.photo);
    form.setFieldsValue(data);
  };

  const handleDelete = async (id) => {
    await deletePortfolio(id);
    refetch();
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const { data } = await uploadPhoto(formData);
    setPhoto(data);
  };

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (data) => (
        <Image
          height={50}
          width={50}
          style={{
            objectFit: "cover",
            borderRadius: "50%",
          }}
          src={getImage(data)}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "External link",
      dataIndex: "url",
      key: "url",
      render: (data) => (
        <Link to={data} rel="noreferrer" target="_blank">
          {data}
        </Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Posted by",
      render: (_, row) =>
        `${row?.user?.firstName ?? ""} ${row?.user?.lastName ?? ""}`,
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(id)}>
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              Modal.confirm({
                title: "Do you want to delete this portfolio ?",
                onOk: () => handleDelete(id),
              })
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <Fragment>
      <Table
        className="skills-table"
        scroll={{
          x: 1000,
        }}
        pagination={false}
        loading={isFetching}
        dataSource={portfolios}
        columns={columns}
        bordered={true}
        title={() => (
          <Fragment>
            <Flex className="table-title2" align="center" justify="space-between" gap={36}>
              <h1 className="skills-title">Portfolios</h1>
              <Input
                className="search-input"
                value={search}
                onChange={handleSearch}
                style={{ width: "auto", flexGrow: 1 }}
                placeholder="Searching..."
              />
              <Button onClick={showModal} type="dashed">
                Add portfolio
              </Button>
            </Flex>
            <div>
              <p className="search-result-text">
                About <span>{total}</span> results match
              </p>
            </div>
          </Fragment>
        )}
      />
      {total > LIMIT ? (
        <Pagination
          className="pagination"
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={(page) => setPage(page)}
        />
      ) : null}
      <Modal
        title="Portfolio info"
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add portfolio" : "Save portfolio"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="portfolio"
          autoComplete="off"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please include project name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter a brief description of your project !",
              },
            ]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>

          <Form.Item
            label="External link"
            name="url"
            rules={[
              {
                required: true,
                message: "Please enter a valid url !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div>
            <input className="upload-btn" type="file" onChange={uploadImage} />
            {photo ? <Image src={getImage(photo)} /> : null}
          </div>
        </Form>
      </Modal>
    </Fragment>
  );
};

const MemoPortfoliosPage = memo(PortfoliosPage);

export default MemoPortfoliosPage;
