import { testCategories, testItems } from '../../../helpers/testData';
import { flattenArr } from '../../../helpers/utility';

export const actions = {
  getEditData: jest.fn().mockResolvedValue({
    editItem: testItems[1],
    categories: flattenArr(testCategories),
  }),
};
