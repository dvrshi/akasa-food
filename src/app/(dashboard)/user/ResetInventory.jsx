'use client'
import React from 'react'

function ResetInventory({ session }) {
  const ResetStock = async () => {
    try {
      const response = await fetch('/api/resetinventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session })
      });
      if (response.ok) {
        console.log('Stock reset successfully');
      } else {
        throw new Error('Failed to reset stock');
      }
    } catch (error) {
      console.error('Error resetting stock:', error);
    }
  }
  return (
    <div>
      <h1>Reset Inventory</h1>
      <button className='bg-orange-600 text-white' onClick={ResetStock}>Restock</button>
    </div>
  )
}

export default ResetInventory