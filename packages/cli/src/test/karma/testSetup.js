// setup file
import Enzyme from 'enzyme/build/index'
import Adapter from 'enzyme-adapter-react-16'

export default Enzyme
Enzyme.configure({adapter: new Adapter()})
