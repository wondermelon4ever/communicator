import { clone } from '../util/Utils';
import drawHelper from '../helpers/DrawHelper';

var eraserDrawHelper = clone(drawHelper);
eraserDrawHelper.setLineWidth(20);
eraserDrawHelper.setStrokeStyle('#FFFFFF');

export default eraserDrawHelper;