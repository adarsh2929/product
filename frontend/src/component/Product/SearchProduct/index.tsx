import { SearchOutlined } from "@ant-design/icons";
import { Col, Input, Row, Space } from "antd";
import { FC } from "react";
import { SearchProductProps } from "./types";


const SearchProduct: FC<SearchProductProps> = (props) => {
  const { performSearchHandler, searchValue } = props;


  return (
    <div style={{marginRight:"10px"}}>
      <div>
        <Row justify={"start"}>
          
          <Col>
            <Space>
              <Input
                
                placeholder="Search by Product Name"
                suffix={<SearchOutlined />}
                onChange={performSearchHandler}
                value={searchValue}
                size="large"
              />
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SearchProduct;
