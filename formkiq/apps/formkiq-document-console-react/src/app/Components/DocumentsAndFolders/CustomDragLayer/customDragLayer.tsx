import { useDragLayer } from 'react-dnd';
import { connect } from 'react-redux';
import { User } from '../../../Store/reducers/auth';
import { RootState } from '../../../Store/store';
import {
  getFileIcon,
  isTagValueIncludes,
} from '../../../helpers/services/toolService';
import { Star, StarFilled } from '../../Icons/icons';

function CustomDragLayer(props: { user: User; brand: string }) {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
    clientOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
  }));

  const isFavorited = isTagValueIncludes(
    item?.tags?.sysFavoritedBy,
    props.user.email
  );
  const renderItem = () => {
    switch (itemType) {
      case 'file':
        return (
          <div
            style={{
              // functional
              transform: `translate(${(clientOffset?.x as number) - 35}px, ${
                (currentOffset?.y as number) - 5
              }px)`,
              position: 'fixed',
              top: 0,
              left: 0,
              pointerEvents: 'none',

              // design only
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '51',
            }}
          >
            <span>
              <img
                src={getFileIcon(item.path)}
                className="w-8 mr-2 inline-block"
                alt="icon"
              />
            </span>
            <span>{item.path}</span>
            <span>
              <div className="w-5 text-gray-400 mx-4">
                {isFavorited ? StarFilled() : Star()}
              </div>
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isDragging || !currentOffset) {
    return null;
  }

  return (
    <div className="draglayer">
      <div>{renderItem()}</div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  const { user } = state.authReducer;
  const { brand } = state.configReducer;
  return { user, brand };
};

export default connect(mapStateToProps)(CustomDragLayer as any);
