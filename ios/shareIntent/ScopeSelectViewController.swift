import UIKit

enum ClientVisibility: String {
    case publicScope = "👀 전체 공개"
    case privateScope = "🔒 나만 보기"
    case friendScope = "👥 친구 공개"
}

let TEMP_VISIBILITY: [ClientVisibility: Visibility] = [
    .publicScope: .scopePublic,
    .privateScope: .scopePrivate,
    .friendScope: .scopeFriend
]

class ScopeSelectViewController: UITableViewController {
    
    let scopes = Array(TEMP_VISIBILITY.keys.map { $0.rawValue }) // Enum을 String 배열로 변환

    var didSelectScope: ((ClientVisibility) -> Void)?

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "scopeCell")
      
        let headerLabel = UILabel()
        headerLabel.text = "공개범위 선택"
        headerLabel.textAlignment = .center
        headerLabel.backgroundColor = .systemGray5 // 선택적 배경색
        headerLabel.font = UIFont.boldSystemFont(ofSize: 18)
        headerLabel.frame = CGRect(x: 0, y: 0, width: tableView.frame.width, height: 50) // 높이는 원하는대로 조절

        tableView.tableHeaderView = headerLabel
    }
    
    // MARK: - Table view data source

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return scopes.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "scopeCell", for: indexPath)
        cell.textLabel?.text = scopes[indexPath.row]
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedScopeString = scopes[indexPath.row]
        if let selectedScope = ClientVisibility(rawValue: selectedScopeString) { // 문자열을 Enum으로 변환
            didSelectScope?(selectedScope) // 선택된 ClientVisibility 값 반환
            self.dismiss(animated: true) // 바텀시트를 닫습니다.
        }
    }
}
