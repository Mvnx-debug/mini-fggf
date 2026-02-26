import styles from './Loading.module.css';

export function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
        </div>
    );
}