import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import NavPanel from './NavPanel'
import grid from './Grid.css'
import styles from './SideBar.css'

function NavLink (props) {
  const {name, iconSrc, onClick, isDisabled} = props

  return (
    <li>
      <button
        key={name}
        onClick={onClick}
        disabled={isDisabled}
        className={styles.nav_icon}
      >
        <img src={iconSrc} alt={name} />
      </button>
    </li>
  )
}

const ConnectionIndicator = props => {
  const {isConnected, onNavIconClick} = props
  // TODO(mc): handle connection in progress (state is in place for this)
  const style = isConnected
    ? styles.connected
    : styles.disconnected

  return (
    <div className={styles.connection_status} onClick={onNavIconClick('connect')}>
      <div className={styles.status}>
        <div className={style} />
      </div>
    </div>
  )
}

ConnectionIndicator.propTypes = {
  isConnected: PropTypes.bool.isRequired
}

export default function SideBar (props) {
  const {isNavPanelOpen, onNavClick, onNavIconClick} = props
  const navLinks = props.navLinks.map((link) => NavLink({
    onClick: onNavIconClick(link.name),
    ...link
  }))

  return (
    <aside className={classnames(grid.nav_panel, { [grid.open]: isNavPanelOpen })}>
      <nav className={styles.nav_icons} >
        <ol>
          {navLinks}
        </ol>
        <ConnectionIndicator {...props} />
      </nav>
      <section className={styles.nav_info}>
        <span className={styles.close} onClick={onNavClick}>X</span>
        <NavPanel {...props} />
      </section>
    </aside>
  )
}

SideBar.propTypes = {
  navLinks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    iconSrc: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired
  })).isRequired,
  isConnected: PropTypes.bool.isRequired,
  isNavPanelOpen: PropTypes.bool.isRequired,
  onNavClick: PropTypes.func.isRequired
}
