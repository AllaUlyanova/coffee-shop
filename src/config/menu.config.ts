// Напитки, их рецепты (слои), цены и опции конструктора.
export type LayerType = 'espresso' | 'milk' | 'foam' | 'syrup' | 'water' | 'ice' | 'cream'
export interface Layer {
  type: LayerType
  amount: number // 0..1
  color?: string
}
export type Size = 'S' | 'M' | 'L'
export type LatteArt = 'heart' | 'rosetta' | null

export interface Drink {
  id: string
  name: string
  description: string
  volume: Record<Size, number> // мл
  prices: Record<Size, number>
  hot: boolean
  layers: Layer[] // снизу вверх
  latteArt: LatteArt
  grind?: boolean // нужен ли помол (по умолчанию: есть эспрессо-слой)
}

export const drinks: Drink[] = [
  {
    id: 'espresso',
    name: 'Эспрессо',
    description: 'Короткий и плотный, с золотистой кремой',
    volume: { S: 60, M: 90, L: 120 },
    prices: { S: 140, M: 180, L: 220 },
    hot: true,
    layers: [{ type: 'espresso', amount: 0.42 }, { type: 'cream', amount: 0.08, color: '#C9955A' }],
    latteArt: null,
  },
  {
    id: 'americano',
    name: 'Американо',
    description: 'Эспрессо, разбавленный горячей водой',
    volume: { S: 250, M: 350, L: 450 },
    prices: { S: 170, M: 210, L: 250 },
    hot: true,
    layers: [{ type: 'espresso', amount: 0.2 }, { type: 'water', amount: 0.65, color: '#6b4328' }],
    latteArt: null,
  },
  {
    id: 'cappuccino',
    name: 'Капучино',
    description: 'Эспрессо, взбитое молоко и плотная пена',
    volume: { S: 200, M: 300, L: 400 },
    prices: { S: 220, M: 270, L: 320 },
    hot: true,
    layers: [
      { type: 'espresso', amount: 0.25 },
      { type: 'milk', amount: 0.4 },
      { type: 'foam', amount: 0.3 },
    ],
    latteArt: 'heart',
  },
  {
    id: 'latte',
    name: 'Латте',
    description: 'Много молока, мягкий вкус и тонкая пена',
    volume: { S: 250, M: 350, L: 450 },
    prices: { S: 240, M: 290, L: 340 },
    hot: true,
    layers: [
      { type: 'espresso', amount: 0.18 },
      { type: 'milk', amount: 0.6 },
      { type: 'foam', amount: 0.14 },
    ],
    latteArt: 'rosetta',
  },
  {
    id: 'flat-white',
    name: 'Флэт уайт',
    description: 'Двойной эспрессо и бархатное молоко',
    volume: { S: 160, M: 220, L: 300 },
    prices: { S: 250, M: 300, L: 350 },
    hot: true,
    layers: [
      { type: 'espresso', amount: 0.36 },
      { type: 'milk', amount: 0.5 },
      { type: 'foam', amount: 0.06 },
    ],
    latteArt: 'heart',
  },
  {
    id: 'raf',
    name: 'Раф',
    description: 'Эспрессо со сливками и ванильным сахаром',
    volume: { S: 250, M: 350, L: 450 },
    prices: { S: 290, M: 340, L: 390 },
    hot: true,
    layers: [
      { type: 'syrup', amount: 0.05, color: '#E8D3A0' },
      { type: 'espresso', amount: 0.2 },
      { type: 'cream', amount: 0.55, color: '#E9D3B0' },
      { type: 'foam', amount: 0.1 },
    ],
    latteArt: null,
  },
  {
    id: 'mocha',
    name: 'Мокко',
    description: 'Эспрессо, горький шоколад и молочная пена',
    volume: { S: 250, M: 350, L: 450 },
    prices: { S: 270, M: 320, L: 370 },
    hot: true,
    layers: [
      { type: 'syrup', amount: 0.1, color: '#3a1f12' },
      { type: 'espresso', amount: 0.22 },
      { type: 'milk', amount: 0.4 },
      { type: 'foam', amount: 0.16 },
    ],
    latteArt: 'heart',
  },
  {
    id: 'iced-latte',
    name: 'Айс-латте',
    description: 'Холодный латте со льдом, без пара и спешки',
    volume: { S: 300, M: 400, L: 500 },
    prices: { S: 260, M: 310, L: 360 },
    hot: false,
    layers: [
      { type: 'espresso', amount: 0.18 },
      { type: 'milk', amount: 0.55 },
      { type: 'ice', amount: 1 },
    ],
    latteArt: null,
  },
  {
    id: 'matcha-latte',
    name: 'Матча-латте',
    description: 'Японский чай матча на тёплом молоке',
    volume: { S: 250, M: 350, L: 450 },
    prices: { S: 280, M: 330, L: 380 },
    hot: true,
    layers: [
      { type: 'water', amount: 0.14, color: '#7FA04B' },
      { type: 'milk', amount: 0.56, color: '#C5D8A0' },
      { type: 'foam', amount: 0.14, color: '#E6EFD2' },
    ],
    latteArt: 'heart',
    grind: false,
  },
  {
    id: 'cocoa',
    name: 'Какао',
    description: 'Густое какао на молоке со сливочной шапкой',
    volume: { S: 250, M: 350, L: 450 },
    prices: { S: 230, M: 280, L: 330 },
    hot: true,
    layers: [
      { type: 'milk', amount: 0.66, color: '#6A3E27' },
      { type: 'cream', amount: 0.18, color: '#F4E6D0' },
    ],
    latteArt: null,
    grind: false,
  },
]

export const milks = [
  { id: 'regular', name: 'Обычное', color: '#F3E7D3', extra: 0 },
  { id: 'oat', name: 'Овсяное', color: '#E6D2A9', extra: 60 },
  { id: 'coconut', name: 'Кокосовое', color: '#F7F1E4', extra: 70 },
  { id: 'almond', name: 'Миндальное', color: '#EBDAB8', extra: 70 },
  { id: 'none', name: 'Без молока', color: '#F3E7D3', extra: 0 },
] as const
export type MilkId = (typeof milks)[number]['id']

export const syrups = [
  { id: 'none', name: 'Без сиропа', color: 'transparent' },
  { id: 'vanilla', name: 'Ваниль', color: '#EAD7A0' },
  { id: 'caramel', name: 'Карамель', color: '#C8782A' },
  { id: 'hazelnut', name: 'Лесной орех', color: '#A8764A' },
  { id: 'lavender', name: 'Лаванда', color: '#B7A2D4' },
] as const
export type SyrupId = (typeof syrups)[number]['id']

export const extras = { shot: 70, syrup: 40 }

export type MenuCategory = 'coffee' | 'noncoffee' | 'dessert'
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
}

const coffeeIds = ['espresso', 'americano', 'cappuccino', 'latte', 'flat-white', 'raf', 'mocha', 'iced-latte']
export const menuItems: MenuItem[] = [
  ...drinks.map<MenuItem>((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    price: d.prices.M,
    category: coffeeIds.includes(d.id) ? 'coffee' : 'noncoffee',
  })),
  { id: 'lemonade', name: 'Лимонад с базиликом', description: 'Лимон, базилик и газированная вода', price: 260, category: 'noncoffee' },
  { id: 'tea-bergamot', name: 'Чай с бергамотом', description: 'Чёрный листовой чай, заваривается 4 минуты', price: 200, category: 'noncoffee' },
  { id: 'croissant', name: 'Круассан с миндалём', description: 'Слоёный, с миндальным кремом', price: 190, category: 'dessert' },
  { id: 'cheesecake', name: 'Чизкейк', description: 'Нью-йоркский, с ягодным соусом', price: 330, category: 'dessert' },
  { id: 'brownie', name: 'Брауни', description: 'Тёмный шоколад и грецкий орех', price: 240, category: 'dessert' },
  { id: 'cinnamon-roll', name: 'Булочка с корицей', description: 'Тёплая, с кремом на сливочном сыре', price: 210, category: 'dessert' },
]

export const categories: { id: MenuCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Всё' },
  { id: 'coffee', label: 'Кофе' },
  { id: 'noncoffee', label: 'Не кофе' },
  { id: 'dessert', label: 'Десерты' },
]
