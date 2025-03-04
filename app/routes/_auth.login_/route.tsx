import { Api } from '@/core/trpc'
import { AppHeader } from '@/designSystem/ui/AppHeader'
import { useNavigate, useSearchParams } from '@remix-run/react'
import { Button, Flex, Form, Input, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { SocialButtons } from '~/core/authentication/client/SocialButtons'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync: login } = Api.authentication.login.useMutation({
    onSuccess: async () => {
      // Wait briefly for session to propagate
      await new Promise(resolve => setTimeout(resolve, 100))
      const returnUrl = searchParams.get('returnUrl') || '/home'
      navigate(returnUrl, { replace: true })
    },
    onError: err => {
      setError(
        `Login failed: ${err.message || 'Please check your credentials.'}`,
      )
      setLoading(false)
    },
  })

  const errorKey = searchParams.get('error')
  const errorMessage = {
    Signin: 'Try signing in with a different account.',
    OAuthSignin: 'Try signing in with a different account.',
    OAuthCallback: 'Try signing in with a different account.',
    OAuthCreateAccount: 'Try signing in with a different account.',
    EmailCreateAccount: 'Try signing in with a different account.',
    Callback: 'Try signing in with a different account.',
    OAuthAccountNotLinked:
      'To confirm your identity, sign in with the same account you used originally.',
    EmailSignin: 'Check your email address.',
    CredentialsSignin:
      'Sign in failed. Check the details you provided are correct.',
    default: 'Unable to sign in.',
  }[errorKey ?? 'default']

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      form.setFieldsValue({ email: 'test@test.com', password: 'password' })
    }
  }, [form])

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError(null)

    try {
      await login({ email: values.email, password: values.password })
    } catch (error: any) {
      console.error(`Login error: ${error.message}`, { variant: 'error' })
      setError('Login failed. Please try again or contact support.')
      setLoading(false)
    }
  }

  return (
    <Flex align="center" justify="center" vertical flex={1}>
      <Flex
        vertical
        style={{ width: '340px', padding: '100px 0' }}
        gap="middle"
      >
        <AppHeader description="Welcome!" />

        {(errorKey || error) && (
          <Typography.Text type="danger">
            {error || errorMessage}
          </Typography.Text>
        )}

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              type="email"
              placeholder="Your email"
              autoComplete="email"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password
              placeholder="Your password"
              autoComplete="current-password"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="end">
              <Button
                type="link"
                onClick={() => navigate('/reset-password')}
                style={{ padding: 0, margin: 0 }}
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? <Spin size="small" /> : 'Sign in'}
            </Button>
          </Form.Item>
        </Form>

        <SocialButtons />

        <Button
          ghost
          style={{ border: 'none' }}
          onClick={() => navigate('/register')}
          disabled={isLoading}
        >
          <Flex gap="small" justify="center">
            <Typography.Text type="secondary">No account?</Typography.Text>
            <Typography.Text>Sign up</Typography.Text>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}
