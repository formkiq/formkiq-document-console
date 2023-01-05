import { Helmet } from "react-helmet-async"
import { RootState } from '../../Store/store';
import { connect } from "react-redux";

export function DocumentSettings() {
  
  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <div>
        DISPLAY SETTINGS HERE
      </div>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { user } = state.authReducer;
  return { user: user }
};

export default connect(mapStateToProps)(DocumentSettings as any);
  