// src/data/learningContent.js
import polityContent from './content/polity.json';
import economyContent from './content/economy.json';
import geographyContent from './content/geography.json';
import historyContent from './content/history.json';
import environmentContent from './content/environment.json';
import scienceContent from './content/science.json';

const learningContent = {
  ...polityContent,
  ...economyContent,
  ...geographyContent,
  ...historyContent,
  ...environmentContent,
  ...scienceContent
};

export default learningContent;