export function getDebtStatusLabel(status) {
  if (status === 'lunas') {
    return 'Lunas'
  }

  if (status === 'inactive') {
    return 'Inactive'
  }

  return 'Active'
}

export function getDebtStatusTone(status) {
  if (status === 'lunas') {
    return 'bg-emerald-100 text-emerald-700'
  }

  if (status === 'inactive') {
    return 'bg-slate-200 text-slate-600'
  }

  return 'bg-amber-100 text-amber-700'
}

export function createDebtFormFromItem(item) {
  return {
    name: item?.name || '',
    principalAmount: item?.principal_amount || '',
    tenorValue: item?.tenor_value ?? '',
    tenorUnit: item?.tenor_unit || '',
    paymentAmount: item?.payment_amount || '',
    note: item?.note || '',
  }
}
