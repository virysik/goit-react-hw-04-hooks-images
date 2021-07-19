import { useState } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import s from './Searchbar.module.css'

function Searchbar({ onSubmit }) {
  const [value, setValue] = useState('')

  const handleInputChange = ({ target }) => {
    setValue(target.value)
  }

  const handleFormSublit = (e) => {
    e.preventDefault()

    if (value.trim() === '') {
      return toast('⚠️Please enter search query name')
    }

    onSubmit(value)
    setValue('')
  }

  return (
    <header className={s.searchbar}>
      <form className={s.searchForm} onSubmit={handleFormSublit}>
        <button type="submit" className={s.searchFormButton}>
          <span className={s.searchFormButtonLabel}>Search</span>
        </button>

        <input
          className={s.searchFormInput}
          type="text"
          onChange={handleInputChange}
          value={value}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  )
}

export default Searchbar

Searchbar.propTypes = { onSubmit: PropTypes.func.isRequired }
