const state = {
entries: JSON.parse(localStorage.getItem('txs') || '[]'),
type: 'income'
}
const amountEl = document.getElementById('amount')
const dateEl = document.getElementById('date')
const noteEl = document.getElementById('note')
const addBtn = document.getElementById('addBtn')
const txList = document.getElementById('txList')
const balanceEl = document.getElementById('balance')
const totalIncomeEl = document.getElementById('total-income')
const totalExpenseEl = document.getElementById('total-expense')
const countEl = document.getElementById('count')
const btnIncome = document.getElementById('btn-income')
const btnExpense = document.getElementById('btn-expense')
const categoryEl = document.getElementById('category')
dateEl.valueAsDate = new Date()
function setType(t){
state.type = t
btnIncome.classList.toggle('active', t === 'income')
btnExpense.classList.toggle('active', t === 'expense')
}
btnIncome.addEventListener('click', ()=> setType('income'))
btnExpense.addEventListener('click', ()=> setType('expense'))
function format(n){
const o = Number(n) || 0
return o.toLocaleString(undefined, {style:'currency',currency:'NGN',minimumFractionDigits:2})
}
function save(){ localStorage.setItem('txs', JSON.stringify(state.entries)) }
function render(){
let income = 0, expense = 0
txList.innerHTML = ''
state.entries.slice().reverse().forEach((tx, idx) => {
const el = document.createElement('div')
el.className = 'tx'
const left = document.createElement('div'); left.className='left'
const dot = document.createElement('div'); dot.className='dot'; dot.style.background = tx.type==='income'?'var(--income)':'var(--expense)'
const meta = document.createElement('div'); meta.className='meta'
const title = document.createElement('span'); title.textContent = tx.category + ' • ' + tx.note
const small = document.createElement('small'); small.textContent = new Date(tx.date).toLocaleDateString()
meta.appendChild(title); meta.appendChild(small)
left.appendChild(dot); left.appendChild(meta)
const right = document.createElement('div'); right.style.display='flex'; right.style.alignItems='center'; right.style.gap='12px'
const amt = document.createElement('div'); amt.className = 'amt ' + (tx.type==='income'?'income':'expense'); amt.textContent = (tx.type==='income'?'+':'-')+format(tx.amount)
const del = document.createElement('button'); del.textContent='Delete'; del.title='Delete'; del.addEventListener('click', ()=>{ if(confirm('Delete this transaction?')){ state.entries.splice(state.entries.length - 1 - idx,1); save(); render(); } })
right.appendChild(amt); right.appendChild(del)
el.appendChild(left); el.appendChild(right)
txList.appendChild(el)
if(tx.type==='income') income += Number(tx.amount)
else expense += Number(tx.amount)
})
const balance = income - expense
balanceEl.textContent = format(balance)
totalIncomeEl.textContent = format(income)
totalExpenseEl.textContent = format(expense)
countEl.textContent = state.entries.length
}
addBtn.addEventListener('click', ()=>{
const amount = parseFloat(amountEl.value)
const date = dateEl.value
const note = noteEl.value.trim() || '—'
const category = categoryEl.value || 'General'
if(!amount || isNaN(amount)) { alert('Please enter a valid amount.'); return }
if(!date) { alert('Please select a date.'); return }
const tx = { amount: Math.abs(amount).toFixed(2), date, note, type: state.type, category }
state.entries.push(tx)
save()
amountEl.value = ''
noteEl.value = ''
dateEl.valueAsDate = new Date()
setType('income')
render()
})
render()