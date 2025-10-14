import fs from 'fs';
import path from 'path';

const componentName = process.argv[2];

if (!componentName) {
    console.error('Component name is required');
    process.exit(1);
}

const baseDir = path.join(__dirname, '..', 'src', 'components', componentName);

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
}

const indexContent = `
import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface ${componentName}Props {}

const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <View>
      <Text>${componentName}</Text>
    </View>
  );
};

export default ${componentName};
`;

const stylesContent = `
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({});

export default styles;
`;

fs.writeFileSync(path.join(baseDir, 'index.tsx'), indexContent.trimStart());
fs.writeFileSync(path.join(baseDir, 'styles.ts'), stylesContent.trimStart());

console.log(`✅ Component '${componentName}' created successfully at ${baseDir}`);