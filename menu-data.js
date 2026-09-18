// Official menu snapshot, checked 2026-09-18.
// https://www.yupdduk.com/sub/menu/yup-menu
// Listed prices are reference prices, excluding delivery fees and option changes.
const CATEGORY_LABELS = { main: '메인', topping: '토핑', side: '사이드·음료', chicken: '닭발', set: '세트', kit: '밀키트' };
const MENU = [
  ['original', '엽기메뉴', 14000, 'main'],
  ['rose', '로제메뉴', 16000, 'main'],
  ['mala', '마라떡볶이', 16000, 'main'],
  ['mala-rose', '마라로제떡볶이', 18000, 'main'],
  ['small', '2인 엽기떡볶이', 9000, 'main'],
  ['chicken-stew', '엽기닭볶음탕', 24000, 'main'],
  ['rice-cake', '떡추가', 1000, 'topping'],
  ['fish-cake', '오뎅추가', 1000, 'topping'],
  ['cabbage', '양배추 추가', 1000, 'topping'],
  ['green-onion', '대파 추가', 1000, 'topping'],
  ['cheese', '모짜치즈', 3000, 'topping'],
  ['corn', '콘마요', 2500, 'topping'],
  ['ham', '햄(7개)', 1000, 'topping'],
  ['bacon', '베이컨', 3000, 'topping'],
  ['beef', '우삼겹', 3000, 'topping'],
  ['tofu', '통유부(4개)', 1000, 'topping'],
  ['cheese-dumpling', '퐁당치즈만두(7개)', 2000, 'topping'],
  ['egg', '계란(2개)', 1500, 'topping'],
  ['quail', '메추리알(5개)', 1000, 'topping'],
  ['fen', '분모자', 2500, 'topping'],
  ['wide-noodle', '중국당면', 2500, 'topping'],
  ['glass-noodle', '당면사리', 2000, 'topping'],
  ['udon', '우동사리', 2000, 'topping'],
  ['tuna', '참치마요밥', 3500, 'side'],
  ['rice-ball', '주먹김밥(셀프)', 2000, 'side'],
  ['steamed-egg', '계란찜', 2000, 'side'],
  ['porridge', '계란야채죽', 5000, 'side'],
  ['sundae', '순대', 3000, 'side'],
  ['fried-fish', '오뎅튀김(15개)', 2000, 'side'],
  ['fried-mix', '모둠튀김', 2000, 'side'],
  ['dumpling', '만두(4개)', 2000, 'side'],
  ['seaweed-roll', '김말이(3개)', 2000, 'side'],
  ['vegetable-fry', '야채튀김(1개)', 1000, 'side'],
  ['pork', '꿔바로우(5개)', 5900, 'side'],
  ['wing', '엽봉(5개)', 5000, 'side'],
  ['crispy-cheese', '바삭치즈만두(7개)', 2000, 'side'],
  ['hotdog', '엽도그', 2000, 'side'],
  ['potato', '감자채튀김', 2500, 'side'],
  ['seasoning', '엽기시즈닝(버터갈릭맛)', 300, 'side'],
  ['hot-sauce', '엽기핫불소스', 700, 'side'],
  ['rice', '공깃밥', 1000, 'side'],
  ['drink', '음료(유산균)', 1000, 'side'],
  ['grilled-bone', '숯불통뼈닭발', 15000, 'chicken'],
  ['grilled-boneless', '숯불무뼈닭발', 16000, 'chicken'],
  ['soup-bone', '국물통뼈닭발', 16000, 'chicken'],
  ['soup-boneless', '국물무뼈닭발', 17000, 'chicken'],
  ['value-set', '실속세트', 17500, 'set'],
  ['best-set', '베스트세트', 20000, 'set'],
  ['special-set', '스페셜세트', 25000, 'set'],
  ['grilled-set', '숯불닭발세트', 18500, 'set'],
  ['soup-set', '국물닭발세트', 19500, 'set'],
  ['original-kit', '엽기밀키트', 9000, 'kit'],
  ['rose-kit', '로제밀키트', 11000, 'kit']
].map(([id, name, price, category]) => ({ id, name, price, category }));

// Editorial suggestions, not official bundles or popularity rankings.
const COMBOS = [
  { id: 'classic', title: '매콤하고 고소하게', tag: '기본부터', mark: '01', description: '엽기메뉴에 치즈를 더하고, 주먹김밥을 국물에 곁들이는 조합.', items: ['original', 'cheese', 'rice-ball'] },
  { id: 'creamy', title: '로제에 바삭함 한 입', tag: '고소한 취향', mark: '02', description: '로제와 베이컨의 고소함에 바삭치즈만두로 식감을 더해 보세요.', items: ['rose', 'bacon', 'crispy-cheese'] },
  { id: 'chewy', title: '얼얼하게, 쫀득하게', tag: '마라 취향', mark: '03', description: '마라떡볶이에 분모자와 우삼겹을 추가하고 싶은 날의 조합.', items: ['mala', 'fen', 'beef'] },
  { id: 'simple', title: '가볍게 차리는 한 상', tag: '작은 예산', mark: '04', description: '2인 엽기떡볶이에 주먹김밥과 모둠튀김을 곁들여 보세요.', items: ['small', 'rice-ball', 'fried-mix'] }
];

function menuById(id) { return MENU.find(item => item.id === id); }
function comboTotal(items) { return items.reduce((sum, id) => sum + menuById(id).price, 0); }
function basketTotal(basket) { return Object.entries(basket).reduce((sum, [id, count]) => sum + menuById(id).price * count, 0); }
function filteredMenu(category, query) {
  const normalized = query.replace(/\s/g, '').toLowerCase();
  return MENU.filter(item => (category === 'all' || item.category === category) && item.name.replace(/\s/g, '').toLowerCase().includes(normalized));
}
function updateQuantity(basket, id, change) {
  if (!menuById(id)) return;
  const next = Math.max(0, Math.min(9, (basket[id] || 0) + change));
  if (next) basket[id] = next;
  else delete basket[id];
}
