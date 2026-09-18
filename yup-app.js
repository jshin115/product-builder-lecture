const basket = {};
let category = 'all';
const byId = id => document.getElementById(id);
const won = amount => `${amount.toLocaleString('ko-KR')}원`;
const announce = message => { byId('status').textContent = message; };

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderMenu() {
  const items = filteredMenu(category, byId('search').value);
  byId('menu-count').textContent = `${items.length}개 메뉴`;
  byId('no-results').hidden = items.length > 0;
  byId('menu-list').replaceChildren(...items.map(item => {
    const card = element('article', 'menu-card');
    const info = element('div');
    info.append(element('span', 'menu-category', CATEGORY_LABELS[item.category]), element('h3', '', item.name), element('p', 'menu-price', won(item.price)));
    const add = element('button', 'add-button', '+');
    add.type = 'button';
    add.setAttribute('aria-label', `${item.name} 담기`);
    add.addEventListener('click', () => {
      const previous = basket[item.id] || 0;
      updateQuantity(basket, item.id, 1);
      renderBasket();
      announce(previous === 9 ? '같은 메뉴는 최대 9개까지 담을 수 있어요.' : `${item.name} ${basket[item.id]}개를 담았어요.`);
    });
    card.append(info, add);
    return card;
  }));
}

function renderBasket(focusTarget) {
  const entries = Object.entries(basket);
  byId('copy-fallback').hidden = true;
  byId('copy-text').value = '';
  byId('basket-items').replaceChildren();
  if (!entries.length) byId('basket-items').append(element('p', 'empty-basket', '아직 비어 있는 한 상.\n메뉴의 + 버튼으로 취향을 채워 주세요.'));
  entries.forEach(([id, count]) => {
    const item = menuById(id);
    const row = element('div', 'basket-item');
    const info = element('div');
    info.append(element('p', 'basket-item-name', item.name), element('p', 'basket-item-price', won(item.price * count)));
    const quantity = element('div', 'quantity');
    const minus = element('button', '', '−');
    const plus = element('button', '', '+');
    [[minus, -1, '줄이기'], [plus, 1, '늘리기']].forEach(([button, change, label]) => {
      button.type = 'button';
      button.id = `${change < 0 ? 'minus' : 'plus'}-${id}`;
      button.setAttribute('aria-label', `${item.name} 수량 ${label}`);
      button.addEventListener('click', () => {
        updateQuantity(basket, id, change);
        renderBasket(button.id);
        announce(basket[id] ? `${item.name} ${basket[id]}개로 변경했어요.` : `${item.name}을 뺐어요.`);
      });
    });
    plus.disabled = count === 9;
    quantity.append(minus, element('span', '', count), plus);
    row.append(info, quantity);
    byId('basket-items').append(row);
  });
  byId('total').textContent = won(basketTotal(basket));
  byId('copy').disabled = entries.length === 0;
  byId('reset').disabled = entries.length === 0;
  if (focusTarget) {
    const target = byId(focusTarget);
    const fallback = byId('basket-items').querySelector('button') || byId('search');
    (target && !target.disabled ? target : fallback).focus();
  }
}

function applyCombo(combo) {
  Object.keys(basket).forEach(id => delete basket[id]);
  combo.items.forEach(id => updateQuantity(basket, id, 1));
  renderBasket();
  announce(`‘${combo.title}’ 조합을 담았어요. 예상 ${won(basketTotal(basket))}.`);
}

function renderCombos() {
  byId('combo-list').replaceChildren(...COMBOS.map(combo => {
    const card = element('article', 'combo');
    const top = element('div', 'combo-top');
    top.append(element('span', 'tag', combo.tag), element('span', 'combo-number', combo.mark));
    const bottom = element('div', 'combo-bottom');
    const button = element('button', '', '조합 담기 ↗');
    button.type = 'button';
    button.setAttribute('aria-label', `${combo.title} 조합 담기`);
    button.addEventListener('click', () => {
      applyCombo(combo);
      byId('basket-title').setAttribute('tabindex', '-1');
      byId('basket-title').focus({ preventScroll: true });
      byId('basket-title').scrollIntoView({ block: 'center' });
    });
    bottom.append(element('strong', '', won(comboTotal(combo.items))), button);
    card.append(top, element('h3', '', combo.title), element('p', '', combo.description), element('p', 'ingredients', combo.items.map(id => menuById(id).name).join(' + ')), bottom);
    return card;
  }));
}

byId('filters').addEventListener('click', event => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  category = button.dataset.category;
  byId('filters').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderMenu();
});
byId('search').addEventListener('input', renderMenu);
byId('reset').addEventListener('click', () => {
  Object.keys(basket).forEach(id => delete basket[id]);
  renderBasket();
  byId('search').focus();
  announce('담은 메뉴를 모두 비웠어요.');
});

function basketText() {
  return ['나만의 엽떡 조합', ...Object.entries(basket).map(([id, count]) => `${menuById(id).name} × ${count} — ${won(menuById(id).price * count)}`), `예상 합계: ${won(basketTotal(basket))}`, '공식 메뉴판 기본 가격 기준 (2026.09.18). 배달비·할인·옵션 변경 제외.', '주문 가능 메뉴·토핑과 기본 제공 품목은 매장에서 확인해 주세요.'].join('\n');
}
byId('copy').addEventListener('click', async () => {
  const text = basketText();
  try {
    await navigator.clipboard.writeText(text);
    announce('조합을 복사했어요. 친구에게 붙여 넣어 공유해 보세요!');
  } catch {
    byId('copy-fallback').hidden = false;
    byId('copy-text').value = text;
    byId('copy-text').focus();
    byId('copy-text').select();
    announce('자동 복사를 사용할 수 없어요. 아래 내용을 직접 복사해 주세요.');
  }
});

renderCombos();
renderMenu();
renderBasket();
