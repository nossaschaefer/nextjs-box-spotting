const { render, screen } = require("@testing-library/react");
const { default: DeleteBoxBtn } = require("../DeleteBoxBtn");

test("render the delete button", () => {
  render(<DeleteBoxBtn />);
  expect(screen.getByText("Delete")).toHaveTextContent("Delete");
});
