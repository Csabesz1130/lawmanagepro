import React, { useState } from 'react'
import {
  Typography,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  message,
  Spin,
  Row,
  Col,
  Card,
} from 'antd'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import dayjs from 'dayjs'
import { useLocation, useNavigate, useParams } from '@remix-run/react'
import { useUploadPublic } from '@/plugins/upload/client'
import { SocketClient } from '@/plugins/socket/client'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function UserProfilePage() {
  const { user, organization, checkOrganizationRole } = useUserContext()
  const { organizationId } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { mutateAsync: upload } = useUploadPublic()

  const {
    data: userData,
    isLoading,
    refetch,
  } = Api.user.findFirst.useQuery({
    where: { id: user?.id },
    include: { organizationRoles: true },
  })

  const { mutateAsync: updateUser } = Api.user.update.useMutation()

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      let pictureUrl = values.pictureUrl
      if (values.pictureFile) {
        const uploadResult = await upload({ file: values.pictureFile })
        pictureUrl = uploadResult.url
      }

      await updateUser({
        where: { id: user?.id },
        data: {
          name: values.name,
          email: values.email,
          pictureUrl,
          // Add other fields as necessary
        },
      })

      message.success('Profile updated successfully')
      refetch()
    } catch (error) {
      message.error('Failed to update profile')
    }
    setLoading(false)
  }

  if (isLoading) {
    return <Spin size="large" />
  }

  return (
    <PageLayout layout="full-width">
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card>
            <Title level={2}>
              <i className="las la-user-circle"></i> User Profile
            </Title>
            <Text>
              View and update your personal information and preferences
            </Text>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: userData?.name,
                email: userData?.email,
                pictureUrl: userData?.pictureUrl,
              }}
            >
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="pictureUrl" label="Profile Picture">
                <Input />
              </Form.Item>

              <Form.Item name="pictureFile" label="Upload New Picture">
                <Input type="file" accept="image/*" />
              </Form.Item>

              {checkOrganizationRole('attorney') && (
                <>
                  <Form.Item name="expertise" label="Areas of Expertise">
                    <Select
                      mode="multiple"
                      placeholder="Select areas of expertise"
                    >
                      <Select.Option value="civil">Civil Law</Select.Option>
                      <Select.Option value="criminal">
                        Criminal Law
                      </Select.Option>
                      <Select.Option value="corporate">
                        Corporate Law
                      </Select.Option>
                      {/* Add more options as needed */}
                    </Select>
                  </Form.Item>

                  <Form.Item name="billingRate" label="Billing Rate ($/hour)">
                    <InputNumber min={0} step={0.01} />
                  </Form.Item>
                </>
              )}

              {checkOrganizationRole('admin') && (
                <Form.Item name="jurisdiction" label="Jurisdiction">
                  <Input />
                </Form.Item>
              )}

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  <i className="las la-save"></i> Update Profile
                </Button>
              </Form.Item>
            </Form>

            {checkOrganizationRole('admin') && (
              <Button
                onClick={() =>
                  navigate(`/organizations/${organizationId}/roles`)
                }
              >
                <i className="las la-users-cog"></i> Manage User Roles
              </Button>
            )}
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}
