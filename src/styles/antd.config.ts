import { ThemeConfig } from 'antd'

export const theme: ThemeConfig = {
    components: {
        Table: {
            headerBg: 'hsl(0,0%,97%)',
        },
        Tabs: {
            horizontalMargin: '0',
        },
        Select: {
            selectorBg: '#f4f4f5',
            optionSelectedColor: '#1b1464',
            activeBorderColor: '#1b1464',
            hoverBorderColor: '#1b1464',
            borderRadiusLG: 12,
        },
        DatePicker: {
            colorBgContainer: '#f4f4f5',
            activeBorderColor: '#1b1464',
            hoverBorderColor: '#1b1464',
            borderRadiusLG: 12,
        },
    },
}
