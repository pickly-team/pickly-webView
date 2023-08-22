import UIKit
import MobileCoreServices

struct CategoryItem: Codable {
    let orderNum: Int
    let categoryId: Int
    let emoji: String
    let name: String
}

struct POSTBookmarkRequest: Encodable {
    let memberId: Int
    let categoryId: Int
    let url: String
    let title: String
    let visibility: Visibility
}

struct POSTBookmarkResponse: Decodable {
    let id: Int
}

enum Visibility: String, Encodable {
    case scopePublic = "SCOPE_PUBLIC"
    case scopePrivate = "SCOPE_PRIVATE"
    case scopeFriend = "SCOPE_FRIEND"
}


class ShareViewController: UIViewController {
  typealias CategoryTuple = (id: Int, emoji: String, name: String)
  var categories: [CategoryTuple] = []
  var selectedCategoryId: Int?
  var selectedVisibility: Visibility?
  var memberId: Int?
    // UI Elements
    let urlLabel: UILabel = {
        let label = UILabel()
        label.text = "URL"
        label.textColor = .white
        return label
    }()
    
    let urlValueLabel: UILabel = {
        let label = UILabel()
        label.textColor = .gray
        return label
    }()
    
    let titleLabel: UILabel = {
        let label = UILabel()
        label.text = "제목"
        label.textColor = .white
        return label
    }()
    
    let titleTextField: UITextField = {
        let textField = UITextField()
        textField.borderStyle = .roundedRect
        textField.layer.borderColor = UIColor.lightGray.cgColor
        textField.widthAnchor.constraint(equalToConstant: 200).isActive = true
        textField.backgroundColor = UIColor(red: 44.0/255.0, green: 44.0/255.0, blue: 46.0/255.0, alpha: 1.0)
        textField.textColor = .white
        return textField
    }()
    
    let categoryLabel: UILabel = {
        let label = UILabel()
        label.text = "카테고리"
        label.textColor = .white
        return label
    }()
    
    let categoryValueLabel: UILabel = {
        let label = UILabel()
        label.textColor = .white
        label.backgroundColor = UIColor(red: 44.0/255.0, green: 44.0/255.0, blue: 46.0/255.0, alpha: 1.0)
        label.text = "🐶 전체"  // 초기 값
        return label
    }()

  
    let scopeLabel: UILabel = {
        let label = UILabel()
        label.text = "공개범위"
        label.textColor = .white
        return label
    }()
  
    let scopeValueLabel: UILabel = {
        let label = UILabel()
        label.textColor = .white
        label.text = "👀 전체 공개"  // 초기 값
        label.backgroundColor = UIColor(red: 44.0/255.0, green: 44.0/255.0, blue: 46.0/255.0, alpha: 1.0)
        return label
    }()
  
    let categoryContainerView: UIView = {
        let view = UIView()
        view.backgroundColor = UIColor(red: 44.0/255.0, green: 44.0/255.0, blue: 46.0/255.0, alpha: 1.0)
        return view
    }()
  
    let scopeContainerView: UIView = {
        let view = UIView()
        view.backgroundColor = UIColor(red: 44.0/255.0, green: 44.0/255.0, blue: 46.0/255.0, alpha: 1.0)
        return view
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavBar()
        fetchCategories()

        // Tap gesture for categoryValueLabel
        let categoryTapGesture = UITapGestureRecognizer(target: self, action: #selector(showCategorySelection))
        categoryValueLabel.isUserInteractionEnabled = true
        categoryValueLabel.addGestureRecognizer(categoryTapGesture)
      
        // Tap gesture for scopeValueLabel
        let scopeTapGesture = UITapGestureRecognizer(target: self, action: #selector(showScopeSelection))
        scopeValueLabel.isUserInteractionEnabled = true
        scopeValueLabel.addGestureRecognizer(scopeTapGesture)

        // UI 구성 함수 호출
        setupUI()
    }
  
    func setupNavBar() {
        let navBar = UINavigationBar(frame: CGRect(x: 0, y: 0, width: view.bounds.width, height: 44))
        let navItem = UINavigationItem(title: "북마크 추가하기")
        
        let sendButton = UIBarButtonItem(title: "전송하기", style: .plain, target: self, action: #selector(sendAction))
        let closeButton = UIBarButtonItem(title: "닫기", style: .plain, target: self, action: #selector(closeAction))
        
        navItem.leftBarButtonItem = closeButton
        navItem.rightBarButtonItem = sendButton
        navBar.setItems([navItem], animated: false)
        
        self.view.addSubview(navBar)

        // AutoLayout 설정
        navBar.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            navBar.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            navBar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            navBar.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            navBar.heightAnchor.constraint(equalToConstant: 44)
        ])
    }
  
    @objc func sendAction() {
      let sharedDefaults = UserDefaults(suiteName: "group.com.ww8007.pickly")
      guard let memberId = sharedDefaults?.integer(forKey: "memberId") else { return }
      let bookmarkRequest = POSTBookmarkRequest(memberId: memberId, categoryId: self.selectedCategoryId ?? 0, url: self.urlValueLabel.text ?? "", title: self.titleTextField.text ?? "", visibility: self.selectedVisibility ?? .scopePublic)
      print(bookmarkRequest)
        postBookmark(params: bookmarkRequest)
    }

    @objc func closeAction() {
        self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }


 
  
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        didSelectPost()
    }
    
    @objc func showCategorySelection() {
        let categoryVC = CategorySelectionViewController()
        categoryVC.categories = self.categories
        categoryVC.didSelectCategory = { [weak self] selectedCategory in
            self?.categoryValueLabel.text = "\(selectedCategory.emoji) \(selectedCategory.name)"
            self?.selectedCategoryId = selectedCategory.id
            self?.dismiss(animated: true)  // 카테고리를 선택하면 바텀 시트를 닫습니다.
        }
        categoryVC.modalPresentationStyle = .pageSheet  // 바텀 시트 스타일로 설정
        self.present(categoryVC, animated: true, completion: nil)
    }

  
    @objc func showScopeSelection() {
        let scopeVC = ScopeSelectViewController()
        scopeVC.didSelectScope = { [weak self] selectedScope in
          self?.scopeValueLabel.text = selectedScope.rawValue
            self?.dismiss(animated: true)  // 카테고리를 선택하면 바텀 시트를 닫습니다.
            self?.selectedVisibility = TEMP_VISIBILITY[selectedScope]
        }
        scopeVC.modalPresentationStyle = .pageSheet  // 바텀 시트 스타일로 설정
        self.present(scopeVC, animated: true, completion: nil)
    }
    

    
    func setupUI() {
        view.backgroundColor = UIColor(red: 28.0/255.0, green: 28.0/255.0, blue: 30.0/255.0, alpha: 1.0)


        // Add UI elements to view
        view.addSubview(urlLabel)
        view.addSubview(urlValueLabel)
        view.addSubview(titleLabel)
        view.addSubview(titleTextField)
        view.addSubview(categoryLabel)
        view.addSubview(categoryValueLabel)
        view.addSubview(scopeLabel)
        view.addSubview(scopeValueLabel)
      
        let padding: CGFloat = 10  // 원하는 여백 크기
        let paddingVertical: CGFloat = 20
        // categoryContainerView를 뷰에 추가
        view.addSubview(categoryContainerView)
        // categoryValueLabel를 categoryContainerView에 추가
        categoryContainerView.addSubview(categoryValueLabel)
        view.addSubview(scopeContainerView)
        scopeContainerView.addSubview(scopeValueLabel)
        
        // Layout
        urlLabel.translatesAutoresizingMaskIntoConstraints = false
        urlValueLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleTextField.translatesAutoresizingMaskIntoConstraints = false
        categoryLabel.translatesAutoresizingMaskIntoConstraints = false
        categoryValueLabel.translatesAutoresizingMaskIntoConstraints = false
        categoryContainerView.translatesAutoresizingMaskIntoConstraints = false
        scopeContainerView.translatesAutoresizingMaskIntoConstraints = false
        scopeLabel.translatesAutoresizingMaskIntoConstraints = false
        scopeValueLabel.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            urlLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 80),
            urlLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),

            urlValueLabel.topAnchor.constraint(equalTo: urlLabel.bottomAnchor, constant: 10),
            urlValueLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),

            titleLabel.topAnchor.constraint(equalTo: urlValueLabel.bottomAnchor, constant: 30),
            titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            
            titleTextField.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 10),
            titleTextField.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            titleTextField.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),

            categoryLabel.topAnchor.constraint(equalTo: titleTextField.bottomAnchor, constant: 30),
            categoryLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),

            categoryContainerView.topAnchor.constraint(equalTo: categoryLabel.bottomAnchor, constant: 10),
            categoryContainerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            categoryContainerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            
            // 라벨의 제약 조건 (컨테이너 내부에서의 여백)
            categoryValueLabel.leadingAnchor.constraint(equalTo: categoryContainerView.leadingAnchor, constant: paddingVertical),
            categoryValueLabel.trailingAnchor.constraint(equalTo: categoryContainerView.trailingAnchor, constant: -paddingVertical),
            categoryValueLabel.topAnchor.constraint(equalTo: categoryContainerView.topAnchor, constant: padding),
            categoryValueLabel.bottomAnchor.constraint(equalTo: categoryContainerView.bottomAnchor, constant: -padding),
            
            scopeLabel.topAnchor.constraint(equalTo: categoryValueLabel.bottomAnchor, constant: 30),
            scopeLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),

            scopeContainerView.topAnchor.constraint(equalTo: scopeLabel.bottomAnchor, constant: 10),
            scopeContainerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scopeContainerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            
            // 라벨의 제약 조건 (컨테이너 내부에서의 여백)
            scopeValueLabel.leadingAnchor.constraint(equalTo: scopeContainerView.leadingAnchor, constant: paddingVertical),
            scopeValueLabel.trailingAnchor.constraint(equalTo: scopeContainerView.trailingAnchor, constant: -paddingVertical),
            scopeValueLabel.topAnchor.constraint(equalTo: scopeContainerView.topAnchor, constant: padding),
            scopeValueLabel.bottomAnchor.constraint(equalTo: scopeContainerView.bottomAnchor, constant: -padding),
        ])
    }
  
    func getBookmarkTitle() {
        let sharedDefaults = UserDefaults(suiteName: "group.com.ww8007.pickly")
        let memberId = (sharedDefaults?.integer(forKey: "memberId") == 0) ? 112 : sharedDefaults?.integer(forKey: "memberId") ?? 112

        guard let url = URL(string: "https://api.pickly.today/api/members/\(memberId)/bookmark/title") else {
            print("Invalid URL")
            return
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "GET"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let parameters: [String: String] = ["memberId": "\(memberId)", "url": self.urlValueLabel.text ?? ""]


        urlRequest.url = URL(string: url.absoluteString + "?" + parameters.queryString)

        let task = URLSession.shared.dataTask(with: urlRequest) { [weak self] (data, response, error) in
            if let error = error {
                print("Data task error: \(error)")
                return
            }

            guard let data = data else {
                print("Invalid data")
                return
            }

            if let title = String(data: data, encoding: .utf8) {
                DispatchQueue.main.async {
                    self?.titleTextField.text = title
                }
            } else {
                print("Unable to decode title")
            }

        }

        task.resume()
    }

    
    func didSelectPost() {
        let sharedDefaults = UserDefaults(suiteName: "group.com.ww8007.pickly")
        guard let memberId = sharedDefaults?.integer(forKey: "memberId") else { return }
        
        let urlTypeIdentifier = kUTTypeURL as String
        
        guard let itemProvider = (self.extensionContext?.inputItems.first as? NSExtensionItem)?.attachments?.first as? NSItemProvider else { return }
        
        if itemProvider.hasItemConformingToTypeIdentifier(urlTypeIdentifier) {
            itemProvider.loadItem(forTypeIdentifier: urlTypeIdentifier, options: nil) { (item, error) in
              if let url = item as? URL {
                  print("Successfully retrieved URL item: \(url)")
                  DispatchQueue.main.async {
                      self.urlValueLabel.text = url.absoluteString
                      print("Updated urlValueLabel text to: \(url.absoluteString)")
                      self.getBookmarkTitle()
                  }
              } else {
                  print("Error while retrieving URL item: \(error?.localizedDescription ?? "Unknown error")")
              }
            }
        }
    }
  
  func fetchCategories() {
      let sharedDefaults = UserDefaults(suiteName: "group.com.ww8007.pickly")
      guard let memberId = sharedDefaults?.integer(forKey: "memberId") else { return }

      guard let url = URL(string: "https://api.pickly.today/api/members/\(memberId)/categories") else {
          print("Invalid URL")
          return
      }
      
      let task = URLSession.shared.dataTask(with: url) { [weak self] (data, response, error) in
          if let error = error {
              print("Data task error: \(error)")
              return
          }
          
          guard let data = data else {
              print("Invalid data")
              return
          }
          
          do {
              let decodedResponse = try JSONDecoder().decode([CategoryItem].self, from: data)
              let fetchedCategories = decodedResponse.map { (id: $0.categoryId, emoji: $0.emoji, name: $0.name) }
              
              DispatchQueue.main.async {
                  if let firstCategory = decodedResponse.first {
                      self?.categoryValueLabel.text = "\(firstCategory.emoji) \(firstCategory.name)"
                      self?.selectedCategoryId = firstCategory.categoryId
                  } else {
                      // 카테고리가 없을 때
                      let alert = UIAlertController(title: "알림", message: "앗! 사용할 수 있는 카테고리가 없어요", preferredStyle: .alert)
                      alert.addAction(UIAlertAction(title: "확인", style: .default, handler: { _ in
                          self?.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
                      }))
                      self?.present(alert, animated: true, completion: nil)
                  }
                  self?.categories = fetchedCategories
              }


          } catch {
              print("Decoding error: \(error)")
          }
      }
      
      task.resume()
  }
  

  func postBookmark(params: POSTBookmarkRequest) {
      let sharedDefaults = UserDefaults(suiteName: "group.com.ww8007.pickly")

      guard let url = URL(string: "https://api.pickly.today/api/bookmarks") else {
          print("Invalid URL")
          return
      }
      
      var request = URLRequest(url: url)
      request.httpMethod = "POST"
      request.setValue("application/json", forHTTPHeaderField: "Content-Type")
      
      do {
          request.httpBody = try JSONEncoder().encode(params)
      } catch {
          print("Encoding error: \(error)")
          return
      }

      let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
          if let error = error {
              print("Data task error: \(error)")
              return
          }
          
          guard let data = data else {
              print("Invalid data")
              return
          }
          
          do {
              let decodedResponse = try JSONDecoder().decode(POSTBookmarkResponse.self, from: data)
              // 이 부분에서 성공적으로 북마크가 생성된 후의 작업을 수행할 수 있습니다.
              print("Created Bookmark ID:", decodedResponse.id)
              sharedDefaults?.set("refetch", forKey: "sharedData")
              sharedDefaults?.synchronize()
              self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
          } catch {
              print("Decoding error: \(error)")
          }
      }
      
      task.resume()
  }
}

// Helper extension for dictionary to URL query string
extension Dictionary where Key == String, Value == String {
    var queryString: String {
        return self.compactMap { (key, value) -> String? in
            "\(key)=\(value)"
        }.joined(separator: "&")
    }
}


