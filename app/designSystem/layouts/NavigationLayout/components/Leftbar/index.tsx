import { Flex, Menu } from 'antd'
import { useDesignSystem } from '~/designSystem/provider'
import { Theme } from '~/designSystem/theme/theme'

interface Props {
  keySelected?: string
  items: { key: string; label: string; onClick: () => void }[]
  itemsBottom?: { key: string; label: string; onClick: () => void }[]
}

export const Leftbar: React.FC<Props> = ({
  keySelected,
  items,
  itemsBottom,
}) => {
  const { isMobile } = useDesignSystem()

  if (isMobile || items.length === 0) {
    return <></>
  }

  return (
    <Flex
      vertical
      justify="space-between"
      className="py-4"
      style={{
        width: '250px',
        backgroundColor: Theme.components?.Layout?.siderBg,
        borderRight: Theme.components?.Layout?.siderBorderRight,
      }}
    >
      <Menu
        mode="inline"
        inlineIndent={16}
        items={items}
        selectedKeys={[keySelected]}
        style={{ width: '100%' }}
      />
      <Menu
        mode="inline"
        inlineIndent={16}
        items={itemsBottom}
        style={{ width: '100%' }}
      />
    </Flex>
  )
}
