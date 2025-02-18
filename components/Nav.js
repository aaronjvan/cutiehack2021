import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/client'
import { motion } from 'framer-motion'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { Link as NavLink } from 'react-scroll'
import { useRouter } from 'next/router'

import { HiMenu, HiX } from 'react-icons/hi'
import logo from '../public/assets/logo.png'

import styles from '../styles/Nav.module.css'

export default function Nav() {
  const [session] = useSession()
  const router = useRouter()

  const [isMobile, setIsMobile] = useState(false)
  var buttonVariants = {}
  if (!isMobile)
    buttonVariants = {
      hover: { scale: 1.05 },
      tap: { scale: 0.995 },
    }

  const [targetElement, setTargetElement] = useState(null)

  const [checkedIn, setCheckedIn] = useState(false)
  const [inGroup, setInGroup] = useState(false)
  const [groupId, setGroupId] = useState('')
  const [open, setOpen] = useState(false)

  const fetchData = async (id) => {
    const response = await fetch('/api/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: id }),
    })
    const data = await response.json()
    setCheckedIn(Object.keys(data.checkins).length !== 0)
    if (data.checkins[0]) {
      setInGroup(data.checkins[0].groupId !== '')
      if (data.checkins[0].groupId !== '') {
        setGroupId(data.checkins[0].groupId)
      }
    }
  }

  const toggle = () => {
    setOpen(!open)
  }

  const handleResize = () => {
    if (window.innerWidth > 720) setOpen(false)
    setIsMobile(window.innerWidth <= 720)
  }

  useEffect(() => {
    if (session) fetchData(session.user.id)

    window.addEventListener('resize', handleResize)
    setTargetElement(document.querySelector('nav'))
    if (targetElement) {
      if (open) disableBodyScroll(targetElement)
      else enableBodyScroll(targetElement)
    }
  }, [session, router.pathname, targetElement, open])

  return (
    <span className={open && styles.open}>
      <nav className={styles.navbar}>
        <div className={styles.navwrapper}>
          {router.pathname !== '/' ? (
            <Link passHref href="/">
              <div className={styles.logo}>
                <Image
                  src={logo}
                  alt="Logo Image"
                  objectFit="contain"
                  width={40}
                  height={40}
                  quality={100}
                />
              </div>
            </Link>
          ) : (
            <NavLink
              activeClass="active"
              to="Home"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className={styles.tab}
              onClick={() => setOpen(false)}
            >
              <div className={styles.logo}>
                <Image
                  src={logo}
                  alt="Logo Image"
                  objectFit="contain"
                  width={40}
                  height={40}
                  quality={100}
                />
              </div>
            </NavLink>
          )}
          <div>
            <div className={styles.mobileHeader}>
              {router.pathname !== '/' ? (
                <Link passHref href="/">
                  <div className={styles.mobileLogo}>
                    <Image
                      src={logo}
                      alt="Logo Image"
                      objectFit="contain"
                      width={35}
                      height={35}
                      quality={100}
                    />
                  </div>
                </Link>
              ) : (
                <NavLink
                  activeClass="active"
                  to="Home"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className={styles.tab}
                  onClick={() => setOpen(false)}
                >
                  <div className={styles.mobileLogo}>
                    <Image
                      src={logo}
                      alt="Logo Image"
                      objectFit="contain"
                      width={35}
                      height={35}
                      quality={100}
                    />
                  </div>
                </NavLink>
              )}

              <div
                className={styles.menuButtonWrapper}
                onClick={() => toggle()}
              >
                <HiMenu className={styles.menuButton} />
                <HiX className={styles.menuButton} />
              </div>
            </div>
            <div id="nav" className={styles.tabs}>
              {router.pathname !== '/' ? (
                <Link href="/" passHref onClick={() => setOpen(false)}>
                  <div className={styles.tab}>home</div>
                </Link>
              ) : (
                <>
                  <NavLink
                    activeClass="active"
                    to="Home"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className={styles.tab}
                    onClick={() => setOpen(false)}
                  >
                    home
                  </NavLink>
                  <NavLink
                    activeClass="active"
                    to="About"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className={styles.tab}
                    onClick={() => setOpen(false)}
                  >
                    about
                  </NavLink>
                  <NavLink
                    activeClass="active"
                    to="Support"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className={styles.tab}
                    onClick={() => setOpen(false)}
                  >
                    support
                  </NavLink>
                  <NavLink
                    activeClass="active"
                    to="Sponsors"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className={styles.tab}
                    onClick={() => setOpen(false)}
                  >
                    sponsors
                  </NavLink>
                  <NavLink
                    activeClass="active"
                    to="Team"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className={styles.tab}
                    onClick={() => setOpen(false)}
                  >
                    staff
                  </NavLink>
                  <NavLink
                    activeClass="active"
                    to="FAQ"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className={styles.tab}
                    onClick={() => setOpen(false)}
                  >
                    faq
                  </NavLink>
                </>
              )}

              {!session ? (
                <motion.button
                  aria-label="Sign In Button"
                  type="button"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ ease: 'easeInOut', duration: 0.015 }}
                  className={styles.primarybutton}
                  onClick={signIn}
                >
                  apply
                </motion.button>
              ) : (
                <>
                  {!checkedIn && (
                    <Link passHref href="/checkin">
                      <motion.button
                        aria-label="Check In Button"
                        type="button"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ ease: 'easeInOut', duration: 0.015 }}
                        className={styles.primarybutton}
                      >
                        Check In
                      </motion.button>
                    </Link>
                  )}
                  {inGroup && (
                    <Link passHref href={'/groups/' + groupId}>
                      <motion.button
                        aria-label="View Group Button"
                        type="button"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ ease: 'easeInOut', duration: 0.015 }}
                        className={styles.primarybutton}
                      >
                        View Your Group
                      </motion.button>
                    </Link>
                  )}
                  <motion.button
                    aria-label="Sign Out Button"
                    type="button"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ ease: 'easeInOut', duration: 0.015 }}
                    className={styles.secondarybutton}
                    onClick={signOut}
                  >
                    Sign out
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </span>
  )
}
