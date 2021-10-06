let colorsList = [
  '#f5222d',
  '#820014',
  '#fa541c',
  '#871400',
  '#fa8c16',
  '#873800',
  '#faad14',
  '#874d00',
  '#fadb14',
  '#876800',
  '#a0d911',
  '#3f6600',
  '#52c41a',
  '#135200',
  '#13c2c2',
  '#00474f',
  '#1890ff',
  '#003a8c',
  '#2f54eb',
  '#061178',
  '#722ed1',
  '#22075e',
  '#eb2f96',
  '#780650',
]

class ColorGeneratorClass {
  colors: string[]

  constructor(colors: string[]) {
    this.colors = colors
  }

  getColor(): string {
    const index = Math.floor(Math.random() * this.colors.length)
    const color = this.colors[index]
    return color
  }
}

export const ColorGenerator = new ColorGeneratorClass(colorsList)
