import { PageContainer } from '@ant-design/pro-components';

import Guide from '@/components/Guide';
import { trim } from '@/utils/format';

import styles from './index.less';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
