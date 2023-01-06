import { Helmet } from "react-helmet-async"
import { RootState } from '../../Store/store';
import { connect } from "react-redux";

export function DocumentHelp() {
  
  return (
    <>
      <Helmet>
        <title>Help Center</title>
      </Helmet>
      <div>
        DISPLAY HELP CENTER HERE
      </div>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { user } = state.authReducer;
  return { user: user }
};

export default connect(mapStateToProps)(DocumentHelp as any);
  