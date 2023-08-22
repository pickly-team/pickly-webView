import UIKit

class CategorySelectionViewController: UITableViewController {
    
    typealias CategoryTuple = (emoji: String, name: String, id: Int)
    var categories: [CategoryTuple] = []
    var didSelectCategory: ((CategoryTuple) -> Void)?

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "categoryCell")
      
        let headerLabel = UILabel()
        headerLabel.text = "카테고리 선택"
        headerLabel.textAlignment = .center
        headerLabel.backgroundColor = .systemGray5 // 선택적 배경색
        headerLabel.font = UIFont.boldSystemFont(ofSize: 18)
        headerLabel.frame = CGRect(x: 0, y: 0, width: tableView.frame.width, height: 50) // 높이는 원하는대로 조절

        tableView.tableHeaderView = headerLabel
    }

    // MARK: - Table view data source

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return categories.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "categoryCell", for: indexPath)
        let category = categories[indexPath.row]
        cell.textLabel?.text = "\(category.emoji) \(category.name)"
        return cell
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedCategory = categories[indexPath.row]
        didSelectCategory?((emoji: selectedCategory.emoji, name: selectedCategory.name, id: selectedCategory.id))
        navigationController?.popViewController(animated: true)
    }
}
