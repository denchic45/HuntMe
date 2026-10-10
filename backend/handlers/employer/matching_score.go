package employer

import (
	"fmt"
	"math"
	"regexp"
	"sort"
	"strings"
)

type MatchRequirementRequest struct {
	RoleTitle          string   `json:"roleTitle"`
	TargetGrade        string   `json:"targetGrade"`
	RequiredSkills     []string `json:"requiredSkills"`
	ProjectDescription string   `json:"projectDescription"`
	MaxSalaryBudget    *int64   `json:"maxSalaryBudget"`
}

type MatchResultItem struct {
	Candidate        CandidateSearchItem `json:"candidate"`
	MatchScore       float64             `json:"matchScore"`
	MatchExplanation string              `json:"matchExplanation"`
}

type MatchResponse struct {
	Matches []MatchResultItem `json:"matches"`
}

type matchRequirement struct {
	Request               MatchRequirementRequest
	GradeRank             int
	SpecializationAliases []string
	RequiredSkills        []string
	PreferredSkills       []string
}

type matchRoleDefinition struct {
	Terms   []string
	Aliases []string
}

var matchRoleDefinitions = []matchRoleDefinition{
	{Terms: []string{"backend", "back-end", "back end", "бэкенд", "бекенд"},
		Aliases: []string{"backend", "backend developer", "backend engineer", "backend-разработчик", "бэкенд", "бекенд", "бэкенд-разработчик", "бекенд-разработчик"}},
	{Terms: []string{"frontend", "front-end", "front end", "фронтенд"},
		Aliases: []string{"frontend", "frontend developer", "frontend engineer", "frontend-разработчик", "фронтенд", "фронтенд-разработчик"}},
	{Terms: []string{"devops", "sre", "devsecops"},
		Aliases: []string{"devops", "devops engineer", "sre", "sre engineer", "devsecops", "devops-инженер"}},
	{Terms: []string{"qa", "quality assurance", "tester", "тестировщик"},
		Aliases: []string{"qa", "qa engineer", "quality assurance", "tester", "тестировщик"}},
	{Terms: []string{"mobile", "android", "ios", "мобильный"},
		Aliases: []string{"mobile", "mobile developer", "android", "android developer", "ios", "ios developer", "мобильный разработчик"}},
	{Terms: []string{"data scientist", "data science", "machine learning", "ml engineer"},
		Aliases: []string{"data scientist", "data science", "machine learning", "ml", "ml engineer", "data science / ml"}},
	{Terms: []string{"data engineer", "data engineering"},
		Aliases: []string{"data engineer", "data engineering"}},
	{Terms: []string{"fullstack", "full-stack", "full stack", "фулстек", "фуллстек"},
		Aliases: []string{"fullstack", "fullstack developer", "full-stack", "full-stack developer", "full stack", "full stack developer", "фулстек", "фуллстек"}},
}

type matchSkillDefinition struct {
	Name    string
	Aliases []string
}

var matchSkillDefinitions = []matchSkillDefinition{
	{Name: "Go", Aliases: []string{"go", "golang"}},
	{Name: "PostgreSQL", Aliases: []string{"postgresql", "postgres"}},
	{Name: "JavaScript", Aliases: []string{"javascript", "js"}},
	{Name: "TypeScript", Aliases: []string{"typescript", "ts"}},
	{Name: "Vue", Aliases: []string{"vue", "vue.js", "vuejs"}},
	{Name: "React", Aliases: []string{"react", "react.js", "reactjs"}},
	{Name: "Node.js", Aliases: []string{"node.js", "nodejs"}},
	{Name: "C#", Aliases: []string{"c#", "csharp", "c sharp"}},
	{Name: ".NET", Aliases: []string{".net", "dotnet"}},
	{Name: "Kubernetes", Aliases: []string{"kubernetes", "k8s"}},
	{Name: "Docker", Aliases: []string{"docker"}},
	{Name: "Redis", Aliases: []string{"redis"}},
	{Name: "Kafka", Aliases: []string{"kafka", "apache kafka"}},
	{Name: "gRPC", Aliases: []string{"grpc"}},
	{Name: "Python", Aliases: []string{"python"}},
	{Name: "Java", Aliases: []string{"java"}},
	{Name: "C++", Aliases: []string{"c++", "cpp"}},
	{Name: "MySQL", Aliases: []string{"mysql"}},
	{Name: "MongoDB", Aliases: []string{"mongodb", "mongo"}},
	{Name: "RabbitMQ", Aliases: []string{"rabbitmq"}},
	{Name: "Linux", Aliases: []string{"linux"}},
	{Name: "Terraform", Aliases: []string{"terraform"}},
	{Name: "Prometheus", Aliases: []string{"prometheus"}},
	{Name: "GraphQL", Aliases: []string{"graphql"}},
	{Name: "SQL", Aliases: []string{"sql"}},
}

func prepareMatchRequirement(input MatchRequirementRequest) (matchRequirement, error) {
	input.RoleTitle = strings.TrimSpace(input.RoleTitle)
	input.TargetGrade = strings.TrimSpace(input.TargetGrade)
	input.ProjectDescription = strings.TrimSpace(input.ProjectDescription)
	if input.RoleTitle == "" {
		return matchRequirement{}, fmt.Errorf("roleTitle обязателен")
	}
	grade := matchGradeRank(input.TargetGrade)
	if grade == 0 {
		return matchRequirement{}, fmt.Errorf("targetGrade должен быть Junior, Middle, Senior или Lead")
	}
	if len(input.RequiredSkills) == 0 || len(input.RequiredSkills) > 50 {
		return matchRequirement{}, fmt.Errorf("requiredSkills должен содержать от 1 до 50 навыков")
	}
	if input.MaxSalaryBudget != nil && *input.MaxSalaryBudget < 0 {
		return matchRequirement{}, fmt.Errorf("maxSalaryBudget не может быть отрицательным")
	}
	aliases, err := matchRoleAliases(input.RoleTitle)
	if err != nil {
		return matchRequirement{}, err
	}

	required := make([]string, 0, len(input.RequiredSkills))
	seen := make(map[string]bool)
	for _, raw := range input.RequiredSkills {
		key := matchSkillKey(raw)
		if key == "" {
			return matchRequirement{}, fmt.Errorf("requiredSkills не должен содержать пустые навыки")
		}
		if !seen[key] {
			seen[key] = true
			required = append(required, key)
		}
	}
	preferred := make([]string, 0)
	for _, definition := range matchSkillDefinitions {
		key := matchSkillKey(definition.Name)
		if seen[key] {
			continue
		}
		for _, alias := range definition.Aliases {
			if matchTextContainsTerm(input.ProjectDescription, alias) {
				preferred = append(preferred, key)
				break
			}
		}
	}
	return matchRequirement{
		Request: input, GradeRank: grade, SpecializationAliases: aliases,
		RequiredSkills: required, PreferredSkills: preferred,
	}, nil
}

func matchRoleAliases(title string) ([]string, error) {
	var selected []string
	for _, definition := range matchRoleDefinitions {
		for _, term := range definition.Terms {
			if matchTextContainsTerm(title, term) {
				if selected != nil {
					return nil, fmt.Errorf("roleTitle содержит несколько направлений; укажи одну специализацию")
				}
				selected = definition.Aliases
				break
			}
		}
	}
	if selected != nil {
		return selected, nil
	}
	if matchTextContainsTerm(title, "go") || matchTextContainsTerm(title, "golang") {
		return matchRoleDefinitions[0].Aliases, nil
	}
	return nil, fmt.Errorf("Не удалось определить специализацию по roleTitle: укажи Backend, Frontend, DevOps, QA, Mobile, Data Science, Data Engineering или Fullstack")
}

func matchTextContainsTerm(text, term string) bool {
	pattern := `(?i)(^|[^\p{L}\p{N}_])` + regexp.QuoteMeta(term) + `($|[^\p{L}\p{N}_])`
	return regexp.MustCompile(pattern).MatchString(text)
}

func matchSkillKey(value string) string {
	key := strings.ToLower(strings.TrimSpace(value))
	for _, definition := range matchSkillDefinitions {
		for _, alias := range definition.Aliases {
			if key == alias {
				return strings.ToLower(definition.Name)
			}
		}
	}
	return key
}

func matchSkillName(key string) string {
	for _, definition := range matchSkillDefinitions {
		if strings.ToLower(definition.Name) == key {
			return definition.Name
		}
	}
	return key
}

func matchGradeRank(grade string) int {
	switch grade {
	case "Junior":
		return 1
	case "Middle":
		return 2
	case "Senior":
		return 3
	case "Lead":
		return 4
	default:
		return 0
	}
}

func scoreMatchingCandidate(candidate CandidateSearchItem, requirement matchRequirement) (MatchResultItem, bool) {
	grade := matchGradeRank(candidate.VerifiedGrade)
	if grade < requirement.GradeRank || strings.TrimSpace(candidate.Category) == "" {
		return MatchResultItem{}, false
	}
	if candidate.Specialization == nil {
		return MatchResultItem{}, false
	}
	specialization := strings.ToLower(strings.TrimSpace(*candidate.Specialization))
	compatible := false
	for _, alias := range requirement.SpecializationAliases {
		if specialization == alias {
			compatible = true
			break
		}
	}
	if !compatible {
		return MatchResultItem{}, false
	}
	if budget := requirement.Request.MaxSalaryBudget; budget != nil {
		if candidate.DesiredSalary == nil || *candidate.DesiredSalary > *budget {
			return MatchResultItem{}, false
		}
	}
	skills := make(map[string]bool, len(candidate.Skills))
	for _, skill := range candidate.Skills {
		skills[matchSkillKey(skill)] = true
	}
	requiredNames := make([]string, 0, len(requirement.RequiredSkills))
	for _, skill := range requirement.RequiredSkills {
		if !skills[skill] {
			return MatchResultItem{}, false
		}
		requiredNames = append(requiredNames, matchSkillName(skill))
	}

	score := 40.0
	gradePoints := 20.0
	if grade > requirement.GradeRank {
		gradePoints = 18
	}
	score += gradePoints

	parts := []string{
		fmt.Sprintf("Specialization: %s", *candidate.Specialization),
		fmt.Sprintf("All required skills are matched (%d/%d): %s", len(requiredNames), len(requiredNames), strings.Join(requiredNames, ", ")),
		fmt.Sprintf("VerifiedGrade %s; needed %s", candidate.VerifiedGrade, requirement.Request.TargetGrade),
	}
	if candidate.TestScore != nil {
		value := *candidate.TestScore
		if math.IsNaN(value) || math.IsInf(value, 0) || value < 0 || value > 100 {
			candidate.TestScore = nil
		}
	}
	if candidate.TestScore != nil {
		score += 20 * *candidate.TestScore / 100
		parts = append(parts, fmt.Sprintf("Test results: %.1f/100", *candidate.TestScore))
	} else {
		parts = append(parts, "No test reuslts")
	}

	if len(requirement.PreferredSkills) == 0 {
		score += 10
	} else {
		matched := make([]string, 0)
		for _, skill := range requirement.PreferredSkills {
			if skills[skill] {
				matched = append(matched, matchSkillName(skill))
			}
		}
		score += 10 * float64(len(matched)) / float64(len(requirement.PreferredSkills))
		context := fmt.Sprintf("Additional: %d/%d", len(matched), len(requirement.PreferredSkills))
		if len(matched) > 0 {
			context += " (" + strings.Join(matched, ", ") + ")"
		}
		parts = append(parts, context)
	}
	if candidate.HasFspVerified {
		score += 10
		parts = append(parts, "FSP achievements")
	} else {
		parts = append(parts, "No FSP aschievements")
	}
	if requirement.Request.MaxSalaryBudget != nil {
		parts = append(parts, fmt.Sprintf("DesiredSalary %d ₽; MaxSalaryBudget %d ₽", *candidate.DesiredSalary, *requirement.Request.MaxSalaryBudget))
	}
	return MatchResultItem{
		Candidate: candidate, MatchScore: math.Round(score*10) / 10,
		MatchExplanation: strings.Join(parts, "; ") + ".",
	}, true
}

func rankMatchingResults(matches []MatchResultItem, limit int) []MatchResultItem {
	if matches == nil {
		matches = make([]MatchResultItem, 0)
	}
	sort.Slice(matches, func(i, j int) bool {
		a, b := matches[i], matches[j]
		if a.MatchScore != b.MatchScore {
			return a.MatchScore > b.MatchScore
		}
		return a.Candidate.CandidateID < b.Candidate.CandidateID
	})
	if limit > 0 && len(matches) > limit {
		matches = matches[:limit]
	}
	return matches
}
