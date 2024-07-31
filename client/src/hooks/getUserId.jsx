import React from 'react'

function getUserId() {
  return window.localStorage.getItem("userId")
}

export default getUserId
