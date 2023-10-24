import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Space,
  Table,
  message,
} from "antd";

import {
  addSkill,
  deleteSkill,
  getSkill,
  getSkills,
  skillName,
  updateSkill,
} from "../../../redux/slices/skills";
import { LIMIT } from "../../../constants";

import "./style.scss";

const SkillsPage = () => {
  const { skills, loading, total, isModalLoading } = useSelector(
    (state) => state[skillName]
  );

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [callback, setCallback] = useState(false);
  const [percentage, setPercentage] = useState(false);

  useEffect(() => {
    dispatch(getSkills({ search, page }));
  }, [dispatch, search, page, callback]);

  const refetch = () => {
    setCallback(!callback);
  };

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    let check = (await values.percent) > 100;
    if (check) {
      setPercentage(true);
      message.error("Please include a valid percentage");
    } else {
      if (selected === null) {
        await dispatch(addSkill(values));
      } else {
        await dispatch(updateSkill({ id: selected, values }));
      }
      refetch();
      setIsModalOpen(false);
      form.resetFields();
    }
  };

  const handleEdit = async (id) => {
    setSelected(id);
    setIsModalOpen(true);
    const { payload } = await dispatch(getSkill(id));
    form.setFieldsValue(payload);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteSkill(id));
    refetch();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Percent",
      dataIndex: "percent",
      key: "percent",
      render: (data) => <p style={{ marginBottom: "0px" }}>{data}%</p>,
    },
    {
      title: "Fullname",
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
                title: "Do you want to delete this skill ?",
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
        title={() => (
          <Fragment>
            <Flex align="center" justify="space-between" gap={36}>
              <h1 className="skills-title">Skills</h1>
              <Input
                className="search-input"
                value={search}
                onChange={handleSearch}
                style={{ width: "auto", flexGrow: 1 }}
                placeholder="Searching..."
              />
              <Button onClick={showModal} type="dashed">
                Add skill
              </Button>
            </Flex>
            <div>
              <p className="search-result-text">
                About <span>{total}</span> skills match
              </p>
            </div>
          </Fragment>
        )}
        pagination={false}
        loading={loading}
        dataSource={skills}
        columns={columns}
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
        title="Category data"
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add skill" : "Save skill"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="category"
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
                message: "Please include skill name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Percent"
            name="percent"
            rules={[
              {
                required: true,
                message: percentage
                  ? "Please include a value up to 100%"
                  : "Please enter integer only",
              },
            ]}
          >
            <InputNumber status={percentage ? `error` : null} />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default SkillsPage;
