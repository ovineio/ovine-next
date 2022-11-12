import React from 'react';
import { Link, Outlet } from 'umi';
// @ts-ignore
import styles from './index.less';

export default function GlobalLayout() {
  console.log(styles);
  return (
    <div id="container" className={styles.container}>
      <div className={styles.menuContainer}>
        <div className={styles.menuTitle}>Ovine</div>
        <div className={styles.menu}>
          <ul className={styles.ul}>
            <li className={styles.li}>
              <Link to={'/'}> Home </Link>
            </li>
            <li className={styles.li}>
              <Link id="docs" to={'/docs'}> Ovine Docs </Link>
            </li>
            <li className={styles.li}>
              <Link to={'/github'}>GitHub </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.divider} />
      <Outlet />
    </div>
  );
}
